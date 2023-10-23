export function settledOrUndefined<T>(promiseSettledResult: PromiseSettledResult<T>): T | undefined {
  switch (promiseSettledResult.status) {
    case 'fulfilled':
      return promiseSettledResult.value
    case 'rejected':
      return undefined
    default:
      return undefined
  }
}
