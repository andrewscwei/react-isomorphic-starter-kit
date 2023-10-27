/**
 * An interface for interacting with external resources from the application.
 */
export interface UseCase<Params, Result, Options> {
  /**
   * Validates the input parameters of this use case.
   *
   * @throws If validation fails.
   */
  validateParams: (params: Partial<Params>) => asserts params is Params

  /**
   * Runs this use case.
   *
   * @param params - The input parameters for running this use case.
   * @param options - Options for running this use case.
   *
   * @throws If validation fails for the input parameters.
   */
  run: (params: Partial<Params>, options?: Options) => Promise<Result>

  /**
   * Cancels the execution of this use case.
   */
  cancel: () => void
}

/**
 * Namespace containing common {@link UseCase} errors.
 */
export namespace UseCaseError {
  export const CANCELLED = (message: string = 'Use case cancelled') => {
    const error = Error(message)
    error.status = 503

    return error
  }

  export function isCancelled(error: any) {
    if ('status' in error) return error.status === 503

    return false
  }
}
