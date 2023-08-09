import debug from 'debug'
import { DEBUG_CHANNELS, DEBUG_ENABLED } from '../../app.conf'

if (DEBUG_ENABLED && typeof window !== 'undefined') window.localStorage.debug = DEBUG_CHANNELS.map(t => `${t}*`).join(',')

export default function useDebug(subnamespace = '', thread: 'app' | 'server' | 'worker' = 'app') {
  if (DEBUG_ENABLED) {
    const namespace = [thread, ...subnamespace.split(':').filter(Boolean)].join(':')
    if (typeof window === 'undefined') debug.enable(namespace)

    return debug(namespace)
  }
  else {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {}
  }
}
