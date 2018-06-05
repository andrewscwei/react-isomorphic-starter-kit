/**
 * @file Server entry file.
 */

import appConfig from '@/../config/app.conf';
import { renderWithContext, renderWithoutContext } from '@/middleware/ssr';
import debug from 'debug';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import http from 'http';
import ip from 'ip';
import morgan from 'morgan';
import path from 'path';

const log = debug(`app`);
const app = express();

app.use(helmet());
app.use(morgan(`dev`));

/**
 * Serve assets from Webpack dev server in development to enable hot module
 * reloading.
 */
if (process.env.NODE_ENV === `development`) {
  app.use(require(`./middleware/hmr`).devMiddleware());
  app.use(require(`./middleware/hmr`).hotMiddleware());
}

/**
 * Redirect to HTTPS for insecure requests.
 * @see {@link http://expressjs.com/en/api.html#req.secure}
 */
if (process.env.NODE_ENV !== `development` && appConfig.forceSSL) {
  app.set(`trust proxy`, true);
  app.use((req, res, next) => {
    if (req.secure) {
      next();
      return;
    }
    res.redirect(`https://` + req.headers.host + req.url);
  });
}

/**
 * Serve static files and add expire headers.
 * @see {@link https://expressjs.com/en/starter/static-files.html}
 */
if (process.env.NODE_ENV !== `development` && fs.existsSync(path.join(__dirname, `public`))) {
  app.use(express.static(path.join(__dirname, `public`), {
    setHeaders(res) {
      const duration = 1000 * 60 * 60 * 24 * 365 * 10;
      res.setHeader(`Expires`, (new Date(Date.now() + duration)).toUTCString());
      res.setHeader(`Cache-Control`, `max-age=${duration / 1000}`);
    },
  }));
}

/**
 * Server-side rendering setup.
 */
if (appConfig.ssrEnabled) {
  app.use(renderWithContext());
}
else {
  app.use(renderWithoutContext());
}

/**
 * Server 404 error, when the requested URI is not found.
 * @code 404 - URL not found.
 */
app.use((req, _, next) => {
  const err = new Error(`${req.method} ${req.path} is not handled.`);
  err.status = 404;
  next(err);
});

/**
 * Final point of error handling. Any error that was previously thrown will
 * skip all intermediate middleware and go straight to here, where the server
 * will first render an error view if the request accepts html, or respond with
 * the error info in a JSON payload. If the error that ends up here does not
 * have a status code, it will default to 500.
 * @code 500 - Server error.
 */
app.use((err: Error, _: express.Request, res: express.Response) => {
  res.status(err.status || 500).send(err);
});

http
  .createServer(app)
  .listen(appConfig.port)
  .on(`error`, (error: NodeJS.ErrnoException) => {
    if (error.syscall !== `listen`) throw error;

    // Handle specific errors with friendly messages.
    switch (error.code) {
    case `EACCES`:
      log(`Port ${appConfig.port} requires elevated privileges`);
      process.exit(1);
      break;
    case `EADDRINUSE`:
      log(`Port ${appConfig.port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
    }
  })
  .on(`listening`, () => {
    log(`App is listening on ${ip.address()}:${appConfig.port}`);
  });

// Handle unhandled rejections.
process.on(`unhandledRejection`, reason => {
  // tslint:disable-next-line no-console
  console.error(`Unhandled Promise rejection:`, reason);
  process.exit(1);
});

export default app;
