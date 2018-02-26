/**
 * @file Configuration for both client and server environments.
 */

module.exports = {
  // Port.
  port: process.env.PORT || 8080,

  // Force redirects to HTTPS.
  forceSSL: process.env.FORCE_SSL || false,

  // Determines whether SSR is enabled.
  ssrEnabled: process.env.NODE_ENV !== `development`,

  // Default locale.
  defaultLocale: `en`,

  // Supported locales.
  locales: [`en`, `jp`],

  // Config options specific to the `build` tas.
  build: {
    // Public path of all loaded assets.
    publicPath: process.env.PUBLIC_PATH || `/`,

    // Specifies whether the linter should run.
    linter: true,

    // Specifies whether JavaScript and CSS source maps should be generated.
    sourceMap: true,

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