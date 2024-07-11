import { generateLocalizedRoutes } from '@lib/i18n'
import { devMiddleware } from '@lib/server'
import { handle500 } from '@lib/server/handle500'
import { createDebug } from '@lib/utils/createDebug'
import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { i18n } from './i18n.conf'
import { routes } from './routes.conf'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const debug = createDebug(undefined, 'server')
const port = process.env.PORT ?? '8080'
const app = express()
const localizedRoutes = generateLocalizedRoutes(routes, i18n)

// app.use(serveRobots({ routes: localizedRoutes, seo }))
// app.use(serveSitemap({ routes: localizedRoutes, seo }))

if (process.env.NODE_ENV !== 'production') {
  app.use(await devMiddleware({
    routes: localizedRoutes,
    entryPath: path.resolve(__dirname, 'main.server.tsx'),
    templatePath: path.resolve(__dirname, 'index.html'),
  }))
}
else {
// app.use(renderRoot(render, {
//   customScripts: undefined,
//   metadata: {
//     description: DESCRIPTION,
//     maskIconColor: MASK_ICON_COLOR,
//     themeColor: THEME_COLOR,
//     title: TITLE,
//   },
//   i18n,
//   routes: localizedRoutes,
// }))
}

app.use(handle500())

app.listen(port)
  .on('error', (error: NodeJS.ErrnoException) => {
    if (error.syscall !== 'listen') throw error

    switch (error.code) {
      case 'EACCES':
        debug(`Port ${port} requires elevated privileges`)
        process.exit(1)
      case 'EADDRINUSE':
        debug(`Port ${port} is already in use`)
        process.exit(1)
      default:
        throw error
    }
  })
  .on('listening', () => {
    debug('Starting app...', 'OK')
  })

process.on('unhandledRejection', reason => {
  console.error('Unhandled Promise rejection:', reason)
  process.exit(1)
})
