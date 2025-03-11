/**
 * Joins a series of strings into a qualified path.
 *
 * @param args Series of strings to join.
 *
 * @returns The path.
 */
export function joinPaths(...args: string[]): string {
  return args
    .join('/')
    .replace(/\/+/g, '/')
    .replace(/^(.+):\//, '$1://')
    .replace(/^file:/, 'file:/')
    .replace(/\/(\?|&|#[^!])/g, '$1')
    .replace(/\?/g, '&')
    .replace('&', '?')
}
