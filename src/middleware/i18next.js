/**
 * @file i18next middleware.
 * @see {@link https://www.npmjs.com/package/i18next}
 */

import config from '@/../config/app.conf';
import debug from 'debug';
import i18next from 'i18next';
import i18nextExpressMiddleware, { LanguageDetector } from 'i18next-express-middleware';
import i18nextNodeFSBackend from 'i18next-node-fs-backend';
import path from 'path';

const log = debug(`app:i18n`);

export { i18next };

export function i18nextMiddleware(loadPath) {
  if (!i18next.isInitialized) {
    i18next
      .use(i18nextNodeFSBackend)
      .use(LanguageDetector)
      .init({
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
