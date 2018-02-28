/**
 * @file Express middleware for i18next setup.
 *
 * @see {@link https://www.npmjs.com/package/i18next}
 */

import i18next from 'i18next';
import i18nextExpressMiddleware, { LanguageDetector } from 'i18next-express-middleware';

const i18n = i18next.use(LanguageDetector);

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
export function i18nMiddleware() {
  if (!i18n.isInitialized) {
    i18n.init({
      whitelist: $APP_CONFIG.locales,
      fallbackLng: $APP_CONFIG.defaultLocale,
      ns: [`common`],
      defaultNS: `common`,
      interpolation: {
        escapeValue: false // Not needed for React
      }
    });

    if (process.env.NODE_ENV !== `development`) {
      const localeReq = require.context(`@/../config/locales`, true, /^.*\.json$/);
      localeReq.keys().forEach((path) => {
        const locale = path.replace(`./`, ``).replace(`.json`, ``);
        if (!~$APP_CONFIG.locales.indexOf(locale)) return;
        i18n.addResourceBundle(locale, `common`, localeReq(path), true);
      });
    }
  }

  return i18nextExpressMiddleware.handle(i18next);
}
