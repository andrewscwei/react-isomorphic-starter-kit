/**
 * @file Server entry file.
 */

import * as reducers from './reducers';
import config from '../config/app.conf';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import debug from 'debug';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan';
import path from 'path';
import routes from './routes';
import thunk from 'redux-thunk';
import React from 'react';
import StaticRouter from 'react-router-dom/StaticRouter';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

const log = debug(`app`);
const store = createStore(combineReducers(reducers), applyMiddleware(thunk));

// Create app and define global/local members.
const app = express();
app.set(`views`, path.join(__dirname, `views`));
app.set(`view engine`, `pug`);

/**
 * Helmet setup.
 * @see {@link https://www.npmjs.com/package/helmet}
 */
app.use(helmet());

/**
 * CORS setup.
 * @see {@link https://www.npmjs.com/package/cors}
 */
app.use(cors());

/**
 * Serve assets from Webpack dev server in development to enable hot module
 * reloading.
 * @see {@link https://www.npmjs.com/package/webpack-dev-middleware}
 * @see {@link https://www.npmjs.com/package/webpack-hot-middleware}
 */
if (config.env === `development`) {
  const buildConfig = require(path.join(config.cwd, `config/build.client.conf`));
  const webpack = require(`webpack`);
  const devMiddleware = require(`webpack-dev-middleware`);
  const hotMiddleware = require(`webpack-hot-middleware`);
  const compiler = webpack(buildConfig);

  app.use(devMiddleware(compiler, {
    quiet: false,
    noInfo: true,
    inline: false,
    publicPath: buildConfig.output.publicPath,
    stats: { colors: true }
  }));

  app.use(hotMiddleware(compiler, {
    log: false,
    heartbeat: 2000,
    multistep: false
  }));
}

/**
 * Redirect to HTTPS for insecure requests.
 * @see {@link http://expressjs.com/en/api.html#req.secure}
 */
if (config.forceSSL) {
  // Redirect to HTTPS in production.
  app.set(`trust proxy`, true);
  app.use((req, res, next) => {
    if (req.secure) return next();
    res.redirect(`https://` + req.headers.host + req.url);
  });
}

/**
 * HTTP request logger setup.
 * @see {@link https://www.npmjs.com/package/morgan}
 */
app.use(morgan(`dev`));

/**
 * Cookie parsing setup.
 * @see {@link https://www.npmjs.com/package/cookie-parser}
 */
app.use(cookieParser());

/**
 * Serve static files and add expire headers.
 * @see {@link https://expressjs.com/en/starter/static-files.html}
 */
app.use(express.static(path.join(config.cwd, `public`), {
  setHeaders: function(res, path) {
    const duration = 1000 * 60 * 60 * 24 * 365 * 10;
    res.setHeader(`Expires`, (new Date(Date.now() + duration)).toUTCString());
    res.setHeader(`Cache-Control`, `max-age=${duration / 1000}`);
  }
}));

/**
 * Server-side rendering setup.
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */
app.use(async function(req, res) {
  // Find and store all matching client routes based on the request URL.
  const matches = matchRoutes(routes, req.url);

  // For each matching route, fetch async data if required.
  for (let i = 0; i < matches.length; i++) {
    const { route, match } = matches[i];
    if (!(route.component.fetchData instanceof Function)) continue;
    log(`Fetching data for route: ${match.url}`);
    await route.component.fetchData(store);
  }

  let context = {};

  const content = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        {renderRoutes(routes)}
      </StaticRouter>
    </Provider>
  );

  switch (context.status) {
  case 302:
    return res.redirect(302, context.url);
  case 404:
    res.status(404);
    break;
  }

  res.render(`index`, { title: `Express`, data: store.getState(), content });
});

/**
 * Server 404 error, when the requested URI is not found.
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
 * @code 500 - Server error.
 */
app.use(function(err, req, res) {
  // Set locals, only providing error in development.
  res.locals.message = err.message;
  res.locals.error = config.env === `development` ? err : {};

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
