import debug from 'debug'

export default process.env.NODE_ENV === 'development' ? debug('app') : () => {} // eslint-disable-line @typescript-eslint/no-empty-function
