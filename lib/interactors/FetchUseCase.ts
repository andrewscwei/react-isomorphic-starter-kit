import objectHash from 'object-hash'
import { useCache } from '../utils'
import { type UseCase } from './UseCase'
import { UseCaseError } from './UseCaseError'

export type RequestMethod = 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE'

export type Options = {
  /**
   * Ignores the cached result when running this use case.
   */
  skipCache?: boolean

  /**
   * Timeout of the request in seconds. If `undefined` or <= 0, there is no
   * timeout.
   */
  timeout?: number
}

/**
 * A {@link UseCase} for fetching data from external API.
 */
export abstract class FetchUseCase<Params extends Record<string, any>, Result> implements UseCase<Params, Result, Options> {
  protected abortController: AbortController | undefined

  protected cache = useCache({ defaultTTL: this.ttl })

  protected timer: NodeJS.Timeout | undefined

  /**
   * Method of the fetch request.
   */
  get method(): RequestMethod { return 'GET' }

  /**
   * Time to live (TTL) in seconds for the cached result of this use case. If
   * `NaN` or <= 0, caching is disabled.
   */
  get ttl(): number { return 0 }

  /**
   * Indicates if params should be passed to the request as body instead based
   * on the specified request method.
   */
  private get usesParamsAsBody(): boolean {
    switch (this.method) {
      case 'POST':
      case 'PUT':
      case 'PATCH':
      case 'DELETE':
        return true
      default:
        return false
    }
  }

  /**
   * Optional headers to be passed to the request.
   *
   * @params params - The input parameters of this use case.
   */
  getHeaders(params: Params): Record<string, any> | undefined {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    }
  }

  /**
   * Transforms the input parameters of this use case prior to passing them to
   * the request query or body, depending on the request method.
   *
   * @param params - The input parameters of this use case.
   *
   * @returns The transformed parameters to be used to make the request.
   */
  transformParams(params: Params): any {
    return this.usesParamsAsBody ? JSON.stringify(params) : params
  }

  /**
   * Transforms the payload of the response prior to returning it as a result of
   * the execution of this use case.
   *
   * @param payload - The response payload.
   *
   * @returns The transformed result.
   */
  transformResult(payload: any): Result {
    return payload
  }

  /**
   * Transforms any error encountered during the execution of this use case
   * prior to emitting it.
   *
   * @param error - The error.
   *
   * @returns The transformed error.
   */
  transformError(error: unknown): unknown {
    if ((error as any).name === 'AbortError') return UseCaseError.CANCELLED

    return error
  }

  async run(params: Partial<Params> = {}, { skipCache = false, timeout = 5 }: Options = {}): Promise<Result> {
    this.cancel()
    this.abortController = new AbortController()

    this.validateParams(params)

    const cacheKey = this.ttl > 0 ? this.createCacheKey(params) : undefined

    if (!skipCache && cacheKey) {
      const cachedResult = this.cache.getValue<Result>(cacheKey)
      if (cachedResult) return cachedResult
    }

    const method = this.method
    const headers = this.getHeaders(params)
    const url = new URL(this.getEndpoint(params))

    const transformedParams = this.transformParams(params)

    if (!this.usesParamsAsBody) url.search = new URLSearchParams(params).toString()

    try {
      this.startTimeout(timeout)

      const res = await fetch(url, {
        body: this.usesParamsAsBody ? transformedParams : undefined,
        headers,
        method,
        signal: this.abortController?.signal,
      })

      if (!res.ok) {
        throw Error(`[${res.status}] ${res.statusText}`)
      }

      const payload = await res.json()
      const transformedResult = this.transformResult(payload)

      if (cacheKey) {
        this.cache.setValue(transformedResult, cacheKey)
      }

      return transformedResult
    }
    catch (err) {
      const error = this.transformError(err)

      throw error
    }
    finally {
      this.clearTimeout()
    }
  }

  cancel() {
    this.clearTimeout()

    if (this.abortController === undefined) return

    this.abortController.abort()
    this.abortController = undefined
  }

  validateParams(params: Partial<Params>): asserts params is Params {
    // Pass
  }

  protected createCacheKey(params: Params): string {
    return objectHash({
      path: this.getEndpoint(params),
      headers: this.getHeaders(params),
      params,
    }, {
      unorderedSets: true,
      unorderedObjects: true,
    })
  }

  protected startTimeout(seconds = 0) {
    this.clearTimeout()

    if (this.abortController === undefined) return
    if (seconds <= 0) return

    this.timer = setTimeout(() => {
      this.abortController?.abort()
    }, seconds * 1000)
  }

  protected clearTimeout() {
    if (this.timer === undefined) return

    clearTimeout(this.timer)
  }

  /**
   * Returns the endpoint of this {@link FetchUseCase}.
   *
   * @param params - The input parameters of this use case.
   *
   * @return The endpoint.
   */
  abstract getEndpoint(params: Params): string
}
