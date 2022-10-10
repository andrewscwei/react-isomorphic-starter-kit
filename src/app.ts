import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import dev from './middleware/dev'
import localStaticFiles from './middleware/localStaticFiles'
import render from './middleware/render'
import sitemap from './middleware/sitemap'

const app = express()
app.use(morgan('dev'))
app.use(compression())
app.use(helmet({ contentSecurityPolicy: false }))
if (process.env.NODE_ENV === 'development') app.use(dev())
if (process.env.NODE_ENV !== 'development') app.use(localStaticFiles(__dirname))
app.use(sitemap())
app.use(render({ ssrEnabled: process.env.NODE_ENV !== 'development' }))

/**
 * Server 404 error, when the requested URI is not found.
 */
app.use((req, res, next) => {
  const err = Error(`${req.method} ${req.path} is not handled.`)
  err.status = 404
  next(err)
})

/**
 * Final point of error handling. Any error that was previously thrown will skip all intermediate
 * middleware and go straight to here, where the server will first render an error view if the
 * request accepts html, or respond with the error info in a JSON payload. If the error that ends up
 * here does not have a status code, it will default to 500.
 */
app.use((err: Error, req: express.Request, res: express.Response) => {
  res.status(err.status || 500).send(err)
})

export default app
