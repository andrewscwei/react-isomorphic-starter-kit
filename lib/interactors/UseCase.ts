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
