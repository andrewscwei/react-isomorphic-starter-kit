/**
 * An object that manages the life cycle of a {@link UseCase}.
 */
export interface Interactor<UseCaseParams, UseCaseResult> {
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
  value?: UseCaseResult

  /**
   * Runs the use case.
   *
   * @param params - The input parameters of the use case.
   */
  run: (params?: Partial<UseCaseParams>) => Promise<void>

  /**
   * Resets the state of this interactor.
   */
  reset: () => void
}
