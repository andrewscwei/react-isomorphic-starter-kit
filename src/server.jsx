/**
 * @file Server entry file.
 */

import * as reducers from '@/reducers';
import config from '@/../config/app.conf';
import cors from 'cors';
import debug from 'debug';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import i18next from 'i18next';
import i18nMiddleware, { LanguageDetector } from 'i18next-express-middleware';
import morgan from 'morgan';
import path from 'path';
import routes from '@/routes';
import thunk from 'redux-thunk';
import Backend from 'i18next-node-fs-backend';
import React from 'react';
import StaticRouter from 'react-router-dom/StaticRouter';
import Template from '@/views/Template';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { renderToString } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

const log = debug(`app`);

// Set up the store.
const store = createStore(combineReducers(reducers), applyMiddleware(thunk));

// Set up i18n.
const i18n = i18next.use(Backend).use(LanguageDetector).init({
  ...config.i18next,
  backend: {
    loadPath: path.join(config.cwd, `config/locales/{{lng}}.json`),
    jsonIndent: 2
  }
});

// Create app and define global/local members.
const app = express();

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
  const compiler = require(`webpack`)(buildConfig);

  app.use(require(`webpack-dev-middleware`)(compiler, {
    quiet: false,
    noInfo: true,
    inline: false,
    publicPath: buildConfig.output.publicPath,
    stats: { colors: true }
  }));

  app.use(require(`webpack-hot-middleware`)(compiler, {
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
 * i18next setup.
 * @see {@link https://www.npmjs.com/package/i18next}
 */
app.use(i18nMiddleware.handle(i18n));

/**
 * Serve static files and add expire headers.
 * @see {@link https://expressjs.com/en/starter/static-files.html}
 */
if (config.env === `production`) {
  app.use(express.static(path.join(config.cwd, `build/public`), {
    setHeaders: function(res, path) {
      const duration = 1000 * 60 * 60 * 24 * 365 * 10;
      res.setHeader(`Expires`, (new Date(Date.now() + duration)).toUTCString());
      res.setHeader(`Cache-Control`, `max-age=${duration / 1000}`);
    }
  }));
}

/**
 * Server-side rendering setup.
 * @see {@link https://reactjs.org/docs/react-dom-server.html}
 */
app.use(async function(req, res) {
  // Find and store all matching client routes based on the request URL.
  const matches = matchRoutes(routes, req.url);
  const locale = req.language;
  const resources = i18n.getResourceBundle(locale, `common`);

  i18n.changeLanguage(locale);

  // Disable rendering of React components in development.
  if (!config.ssrEnabled) {
    return res.send(`<!doctype html>${renderToString(<Template config={config} initialState={store.getState()} initialLocale={{ locale, resources }}/>)}`);
  }

  // For each matching route, fetch async data if required.
  for (let i = 0; i < matches.length; i++) {
    const { route, match } = matches[i];
    if (!(route.component.fetchData instanceof Function)) continue;
    log(`Fetching data for route: ${match.url}`);
    await route.component.fetchData(store);
  }

  let context = {};

  const body = renderToString(
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <StaticRouter location={req.url} context={context}>
          {renderRoutes(routes)}
        </StaticRouter>
      </Provider>
    </I18nextProvider>
  );

  switch (context.status) {
  case 302:
    return res.redirect(302, context.url);
  case 404:
    res.status(404);
    break;
  }

  return res.send(`<!doctype html>${renderToString(<Template body={body} config={config} initialState={store.getState()} initialLocale={{ locale, resources }}/>)}`);
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
  res.status(err.status || 500).send(err);
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
