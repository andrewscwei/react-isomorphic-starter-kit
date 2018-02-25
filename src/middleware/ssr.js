/**
 * @file Express middleware for server-side rendering of React views.
 */

import config from '@/../config/app.conf';
import debug from 'debug';
import routes from '@/routes';
import Layout from '@/templates/Layout';
import React from 'react';
import StaticRouter from 'react-router-dom/StaticRouter';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { renderToString } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

const log = debug(`app:ssr`);

function render({ i18n, store, manifest, excludeContext = false }) {
  return async function(req, res) {
    log(`Processing path: ${req.normalizedPath || req.path}`);

    // Find and store all matching client routes based on the request URL.
    const matches = matchRoutes(routes, req.normalizedPath || req.path);
    const locale = req.language;

    i18n.changeLanguage(locale);

    // If `excludeBody` is specified, just render the layout without the app
    // markup.
    if (excludeContext) {
      return res.send(`<!doctype html>${renderToString(<Layout config={config} initialState={store.getState()} initialLocale={locale}/>)}`);
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

    return res.send(`<!doctype html>${renderToString(
      <Layout body={body} config={config} initialState={store.getState()} initialLocale={locale} manifest={manifest}/>
    )}`);
  };
}

export function renderWithContext({ i18n, store }) {
  return render({ i18n, store, excludeContext: false });
}

export function renderWithoutContext({ i18n, store }) {
  return render({ i18n, store, excludeContext: true });
}
