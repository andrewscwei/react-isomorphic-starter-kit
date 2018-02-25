/**
 * @file Configuration for both client and server environments.
*/

module.exports = {
  // Port.
  port: process.env.PORT || 8080,

  // Force redirects to HTTPS.
  forceSSL: process.env.FORCE_SSL || false,

  // Determines whether SSR is enabled.
  ssrEnabled: process.env.SSR_ENABLED || false,

  // i18next config.
  // @see {@link https://www.npmjs.com/package/i18next}
  i18next: {
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