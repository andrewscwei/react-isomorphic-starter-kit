import debug from 'debug'

const { debugChannels, debugEnabled } = __BUILD_ARGS__

if (debugEnabled && typeof window !== 'undefined') window.localStorage.debug = debugChannels.map(t => `${t}*`).join(',')

/**
 * Returns an instance of {@link debug} decorated by the specified arguments.
 *
 * @param subnamespace Optional string to append to the namespace of the
 *                     returned {@link debug} instance, delimited by `:`.
 * @param thread The namespace of the returned {@link debug} instance.
 *
 * @returns A {@link debug} instance.
 */
export function useDebug(subnamespace = '', thread: 'app' | 'server' | 'worker' = 'app') {
  if (debugEnabled) {
    const namespace = [thread, ...subnamespace.split(':').filter(Boolean)].join(':')
    if (typeof window === 'undefined') debug.enable(namespace)

    return debug(namespace)
  }
  else {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {}
  }
}
