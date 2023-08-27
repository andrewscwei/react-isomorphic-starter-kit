import debug from 'debug'

const { debugChannels, debugEnabled } = __BUILD_ARGS__

if (debugEnabled && typeof window !== 'undefined') window.localStorage.debug = debugChannels.map(t => `${t}*`).join(',')

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
