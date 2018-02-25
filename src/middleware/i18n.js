/**
 * @file Express middleware for i18next setup.
 *
 * @see {@link https://www.npmjs.com/package/i18next}
 */

import config from '@/../config/app.conf';
import i18next from 'i18next';
import i18nextExpressMiddleware, { LanguageDetector } from 'i18next-express-middleware';
import i18nextNodeFSBackend from 'i18next-node-fs-backend';
import path from 'path';

const i18n = i18next.use(i18nextNodeFSBackend).use(LanguageDetector);

/**
 * Exported i18next instance (not really needed since there is only one shared
 * global instance).
 *
 * @type {Object}
 */
export { i18n };

/**
 * Express middleware for setting up i18next and injecting custom translations.
 *
 * @param {string} translationsDir - Path to locale translations.
 *
 * @return {Function} - Express middleware.
 */
export function i18nMiddleware(translationsDir) {
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
        // Include {{ns}} if you use multiple namespaces.
        loadPath: path.join(translationsDir, `{{lng}}.json`),
        jsonIndent: 2
      }
    });
  }

  return i18nextExpressMiddleware.handle(i18next);
}
