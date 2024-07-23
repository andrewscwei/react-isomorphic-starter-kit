import debug from 'debug'

const DEBUG = process.env.DEBUG
const IS_DEV = process.env.NODE_ENV === 'development'

if (DEBUG || IS_DEV) {
  if (typeof window !== 'undefined') {
    window.localStorage.debug = IS_DEV ? '*' : DEBUG
  }
  else {
    debug.enable(IS_DEV ? '*' : (DEBUG ?? ''))
  }
}

/**
 * Returns an instance of {@link debug} decorated by the specified arguments.
 *
 * @param subnamespace Optional string to append to the namespace of the
 *                     returned {@link debug} instance, delimited by `:`.
 * @param thread The namespace of the returned {@link debug} instance.
 *
 * @returns A {@link debug} instance.
 */
export function createDebug(subnamespace = '', thread: 'app' | 'server' | 'worker' = 'app') {
  const namespace = [thread, ...subnamespace.split(':').filter(Boolean)].join(':')

  if (DEBUG || IS_DEV) {
    return debug(namespace)
  }
  else {
    return () => {}
  }
}
