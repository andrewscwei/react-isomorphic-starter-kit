import debug from 'debug'

export default process.env.APP_ENV !== 'client' || process.env.NODE_ENV === 'development' ? debug('app') : () => {} // eslint-disable-line @typescript-eslint/no-empty-function
