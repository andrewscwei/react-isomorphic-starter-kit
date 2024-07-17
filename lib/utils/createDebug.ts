import debug from 'debug'

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
  if (process.env.NODE_ENV !== 'development') {
    return () => {}
  }
  else {
    const namespace = [thread, ...subnamespace.split(':').filter(Boolean)].join(':')

    if (typeof window === 'undefined') {
      debug.enable(namespace)
    }
    else {
      window.localStorage.debug = [(window.localStorage.debug ?? ''), namespace].join(',')
    }

    return debug(namespace)
  }
}
