/**
 * @file Runtime server config, passed to the client as a global variable named
 *       `__APP_CINFOG__`.
 */

export default {
  /**
   * Full version string.
   */
  version: `v${__BUILD_ARGS__.version}${!__BUILD_ARGS__.env || __BUILD_ARGS__.env === 'production' ? '' : `-${__BUILD_ARGS__.env.substring(0, 3)}`}+build.${__BUILD_ARGS__.buildNumber}`,

  /**
   * Fallback window title.
   */
  title: 'React Isomorphic Starter Kit',

  /**
   * Fallback app description.
   */
  description: __BUILD_ARGS__.packageDescription,

  /**
   * Fallback app URL.
   */
  url: __BUILD_ARGS__.packageHomepage,

  /**
   * Default locale.
   */
  defaultLocale: 'en',

  /**
   * Location in the URL to infer the current locale, available options are
   * "path" and "query".
   */
  changeLocaleStrategy: 'path',

  /**
   * Port.
   */
  port: Number(typeof process !== 'undefined' && process.env.PORT || 8080),

  /**
   * Specifies whether the creation of the HTTP server should be skipped.
   */
  skipHTTP: typeof process !== 'undefined' && process.env.SKIP_HTTP === 'true' || false,
}
