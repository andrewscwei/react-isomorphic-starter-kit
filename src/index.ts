/**
 * @file Server entry file.
 */

import http from 'http'
import ip from 'ip'
import app from './app'
import appConf from './app.conf'
import useDebug from './utils/useDebug'

const debug = useDebug(undefined, 'server')

http
  .createServer(app)
  .listen(appConf.port)
  .on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') throw error

    switch (error.code) {
      case 'EACCES':
        debug(`Port ${appConf.port} requires elevated privileges`)
        process.exit(1)
      case 'EADDRINUSE':
        debug(`Port ${appConf.port} is already in use`)
        process.exit(1)
      default:
        throw error
    }
  })
  .on('listening', () => {
    debug(`App is listening on ${ip.address()}:${appConf.port}`)
  })

process.on('unhandledRejection', reason => {
  console.error('Unhandled Promise rejection:', reason) // eslint-disable-line no-console
  process.exit(1)
})

if (module['hot']) {
  module['hot'].accept();
}
