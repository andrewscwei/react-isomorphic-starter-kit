/**
 * @file Runtime application config.
 */

export default {
  /**
   * Full version string.
   */
  version: `v${__BUILD_ARGS__.version}+build.${__BUILD_ARGS__.buildNumber}`,

  /**
   * Fallback window title.
   */
  title: 'React Isomorphic Starter Kit',

  /**
   * Fallback app description.
   */
  description: 'React isomorphic app starter kit',

  /**
   * Fallback app URL.
   */
  url: 'https://andrewscwei.github.io/react-isomorphic-starter-kit/',

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

  /**
   * Base path of the router (i.e. the `basename` property).
   */
  basePath: __BUILD_ARGS__.basePath,

  /**
   * Specifies whether debug is enabled.
   */
  debugEnabled: process.env.NODE_ENV === 'development',

  /**
   * Enabled debug channels in the client.
   */
  debugChannels: ['app'],
}
