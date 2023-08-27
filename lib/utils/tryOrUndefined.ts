/**
 * Executes a function in a try/catch block and returns the return value if no
 * errors are thrown, `undefined` otherwise.
 *
 * @param fn The function to execute.
 *
 * @returns The return value of `fn` if no errors are thrown, `undefined`
 *          otherwise.
 */
export function tryOrUndefined<T>(fn: () => T): T | undefined {
  try {
    return fn()
  }
  catch (err) {
    return undefined
  }
}
