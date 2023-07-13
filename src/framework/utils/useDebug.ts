import debug from 'debug'
import appConf from '../../app.conf'

if (appConf.debugEnabled && typeof window !== 'undefined') window.localStorage.debug = appConf.debugChannels.map(t => `${t}*`).join(',')

export default function useDebug(subnamespace = '', thread: 'app' | 'server' | 'worker' = 'app') {
  if (appConf.debugEnabled) {
    const namespace = [thread, ...subnamespace.split(':').filter(Boolean)].join(':')
    if (typeof window === 'undefined') debug.enable(namespace)

    return debug(namespace)
  }
  else {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {}
  }
}
