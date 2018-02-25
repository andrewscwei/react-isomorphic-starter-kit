/**
 * @file Express middleware for setting up i18next and injecting custom
 *       translations.
 *
 * @see {@link https://www.npmjs.com/package/i18next}
 */

import config from '@/../config/app.conf';
import i18next from 'i18next';
import i18nextExpressMiddleware, { LanguageDetector } from 'i18next-express-middleware';
import i18nextNodeFSBackend from 'i18next-node-fs-backend';
import path from 'path';

const i18n = i18next.use(i18nextNodeFSBackend).use(LanguageDetector);

export { i18n };

export function i18nMiddleware(loadPath) {
  if (!i18n.isInitialized) {
    i18n.init({
      whitelist: config.locales,
      fallbackLng: config.defaultLocale,
      ns: [`common`],
      defaultNS: `common`,
      interpolation: {
        escapeValue: false // Not needed for React
      },
      backend: {
        loadPath: path.join(loadPath, `{{lng}}.json`),
        jsonIndent: 2
      }
    });
  }

  return i18nextExpressMiddleware.handle(i18next);
}
