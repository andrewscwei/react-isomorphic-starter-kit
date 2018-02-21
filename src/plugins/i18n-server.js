import config from '../../config/app.conf';
import i18n from 'i18next';
import path from 'path';
import Backend from 'i18next-node-fs-backend';
import { LanguageDetector } from 'i18next-express-middleware';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .init({
    whitelist: [`en`, `jp`],
    fallbackLng: `en`,

    // have a common namespace used around the full app
    ns: [`common`],
    defaultNS: `common`,

    debug: true,

    interpolation: {
      escapeValue: false // not needed for react!!
    },

    backend: {
      loadPath: path.join(config.cwd, `config/locales/{{lng}}.json`),
      jsonIndent: 2
    }
  });


export default i18n;