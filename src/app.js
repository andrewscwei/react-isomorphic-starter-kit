/**
 * @file Server entry file.
 */

import bodyParser from 'body-parser';
import config from '../config/app.conf';
import cors from 'cors';
import debug from 'debug';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import methodOverride from 'method-override';
import morgan from 'morgan';
import path from 'path';
import ssr from './middleware/ssr';

const isDev = config.env === `development`;
const viewsDir = path.join(config.cwd, `views`);
const publicDir = path.join(config.cwd, `public`);
const log = debug(`app`);

// Create app and define global/local members.
const app = express();
app.set(`views`, viewsDir);
app.set(`view engine`, `pug`);

// Helmet setup.
// @see {@link https://www.npmjs.com/package/helmet}
app.use(helmet());

// CORS setup.
// @see {@link https://www.npmjs.com/package/cors}
app.use(cors());

// Server redirect setup. Delegate to Webpack dev server in development for HMR,
// redirect to HTTPS in production if the request is not secure.
if (isDev) {
  const hmr = require(`./middleware/hmr`);
  app.use(hmr.dev());
  app.use(hmr.hot());
}
else if (config.forceSSL) {
  // Redirect to HTTPS in production.
  app.set(`trust proxy`, true);
  app.use((req, res, next) => {
    if (req.secure) return next();
    res.redirect(`https://` + req.headers.host + req.url);
  });
}

// HTTP request logger setup.
// @see {@link https://www.npmjs.com/package/morgan}
app.use(morgan(`dev`));

// Form body parsing setup.
// @see {@link https://www.npmjs.com/package/body-parser}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Method override setup.
// @see {@link https://www.npmjs.com/package/method-override}
app.use(methodOverride());

// Serve static files and add expire headers.
app.use(express.static(publicDir, {
  setHeaders: function(res, path) {
    const duration = 1000 * 60 * 60 * 24 * 365 * 10;
    res.setHeader(`Expires`, (new Date(Date.now() + duration)).toUTCString());
    res.setHeader(`Cache-Control`, `max-age=${duration / 1000}`);
  }
}));

// Router setup.
app.get(`*`, ssr);

/**
 * Server 404 error, when the requested URI is not found.
 *
 * @code 404 - URL not found.
 */
app.use(function(req, res, next) {
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
 *
 * @code 500 - Server error.
 */
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development.
  res.locals.message = err.message;
  res.locals.error = isDev ? err : {};

  // Render the error page.
  res.status(err.status || 500).render(`error`);
});

http
  .createServer(app)
  .listen(config.port)
  .on(`error`, function(error) {
    if (error.syscall !== `listen`) throw error;

    // Handle specific errors with friendly messages.
    switch (error.code) {
    case `EACCES`:
      log(`Port ${this.address().port} requires elevated privileges`);
      process.exit(1);
      break;
    case `EADDRINUSE`:
      log(`Port ${this.address().port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
    }
  })
  .on(`listening`, function() {
    log(`App is listening on ${this.address().address}:${this.address().port}`);
  });

export default app;
