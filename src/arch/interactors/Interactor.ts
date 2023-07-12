import { useEffect, useMemo, useRef, useState } from 'react'
import useDebug from '../utils/useDebug'
import UseCase, { UseCaseError } from './UseCase'

export type Interactor<Params, Result> = {
  /**
   * Indicates whether the use case is running.
   */
  isRunning: boolean

  /**
   * Indicates the total number of runs for this interactor.
   */
  runCount: number

  /**
   * The current result of the use case.
   */
  value?: Result

  /**
   * Runs the use case.
   *
   * @param params - The input parameters of the use case.
   */
  run: (params?: Partial<Params>) => Promise<void>

  /**
   * Resets the state of this interactor.
   */
  reset: () => void
}

export type InteractorOptions<Result> = {
  /**
   * Specifies the default value.
   */
  defaultValue?: Result

  /**
   * Handler invoked when the use case cancels running.
   */
  onCancel?: () => void

  /**
   * Handler invoked when the use case fails while running.
   *
   * @param error - The error encountered while running the use case.
   */
  onError?: (error: Error) => void

  /**
   * Handler invoked when the use case runs successfully.
   *
   * @param result - The result of the successful use case interaction.
   */
  onSuccess?: (result: Result) => void
}

const debug = useDebug('interactor')

/**
 * Hook for interacting with a {@link UseCase}.
 *
 * @param UseCaseClass - The {@link UseCase} class to interact with.
 * @param options - @see {@link InteractorOptions}.
 *
 * @returns The {@link Interactor}.
 */
export function useInteractor<Params, Result, Options>(
  UseCaseClass: new () => UseCase<Params, Result, Options>,
  {
    defaultValue,
    onCancel,
    onError,
    onSuccess,
  }: InteractorOptions<Result> = {}
): Interactor<Params, Result> {
  const totalRunCountRef = useRef(0)
  const runningCountRef = useRef(0)
  const [totalRunCount, setTotalRunCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<Result | undefined>(defaultValue)
  const useCase = useMemo(() => new UseCaseClass(), [])
  const useCaseName = useCase.constructor.name

  const invalidateTotalRunCount = () => {
    setTotalRunCount(totalRunCountRef.current)
  }

  const invalidateIsRunning = () => {
    setIsRunning(runningCountRef.current > 0)
  }

  const reset = () => {
    useCase.cancel()

    totalRunCountRef.current = 0
    runningCountRef.current = 0
    invalidateTotalRunCount()
    invalidateIsRunning()

    setResult(undefined)
  }

  const run = async (params: Partial<Params> = {}, options?: Options) => {
    debug(`Interacting with use case <${useCaseName}>...`)

    setResult(undefined)

    totalRunCountRef.current++
    invalidateTotalRunCount()

    runningCountRef.current++
    invalidateIsRunning()

    await useCase.run(params, options)
      .then(res => {
        debug(`Interacting with use case <${useCaseName}>...`, 'OK', res)

        setResult(res)
        onSuccess?.(res)
      })
      .catch(err => {
        if (err === UseCaseError.CANCELLED) {
          debug(`Interacting with use case <${useCaseName}>...`, 'CANCEL')
          onCancel?.()
        }
        else {
          debug(`Interacting with use case <${useCaseName}>...`, 'ERR', err)
          onError?.(err)
        }
      })
      .finally(() => {
        if (runningCountRef.current > 0) runningCountRef.current--
        invalidateIsRunning()
      })
  }

  useEffect(() => () => useCase.cancel(), [])

  return {
    isRunning,
    runCount: totalRunCount,
    value: result,
    run,
    reset,
  }
}

export default Interactor
