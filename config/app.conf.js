/**
 * @file Configuration for both client and server environments.
*/

const path = require(`path`);
const fs = require(`fs`);

module.exports = {
  // Current Node environment, defaults to `development` if none specified.
  env: process.env.NODE_ENV || `production`,

  // Port.
  port: process.env.PORT || 8080,

  // Force redirects to HTTPS.
  forceSSL: process.env.FORCE_SSL || false,

  // Determines whether SSR is enabled.
  ssrEnabled: process.env.NODE_ENV !== `development`,

  assetManifestFileName: `asset-manifest.json`,

  // File paths.
  paths: {
    // Current working directory.
    cwd: path.join(__dirname, `../`),

    // Directory of source code.
    input: path.join(__dirname, `../`, `src`),

    // Directory of compiled code.
    output: path.join(__dirname, `../`, `build`),

    // Directory of config files.
    config: path.join(__dirname, `../`, `config`)
  },

  // i18next config.
  // @see {@link https://www.npmjs.com/package/i18next}
  i18next: {
    // whitelist: fs.readdirSync(path.join(__dirname, `locales`)).filter(v => !(/(^|\/)\.[^/.]/g).test(v)).map(val => path.basename(val, `.json`)),
    whitelist: [`en`, `jp`],
    fallbackLng: `en`,
    ns: [`common`],
    defaultNS: `common`,
    interpolation: {
      escapeValue: false // Not needed for React
    }
  },

  // Config options specific to the `build` tas.
  build: {
    // Public path of all loaded assets.
    publicPath: process.env.PUBLIC_PATH || `/`,

    // Specifies whether the linter should run.
    linter: true,

    // Specifies whether a bundle analyzer report should be generated at the end
    // of the build process.
    analyzer: false
  },

  // Config options specific to the `dev` task.
  dev: {
    // Specifies whether the linter should run.
    linter: false
  }
};