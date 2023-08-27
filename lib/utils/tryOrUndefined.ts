export function tryOrUndefined<T>(fn: () => T): T | undefined {
  try {
    return fn()
  }
  catch (err) {
    return undefined
  }
}
