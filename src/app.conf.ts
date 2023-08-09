/**
 * @file Runtime application config.
 */

/**
 * Full version string.
 */
export const VERSION = `v${__BUILD_ARGS__.version}+build.${__BUILD_ARGS__.buildNumber}`

/**
 * Fallback window title.
 */
export const TITLE = 'React Isomorphic Starter Kit'

/**
 * Fallback app description.
 */
export const DESCRIPTION = 'React isomorphic app starter kit'

/**
 * Base URL of the app.
 */
export const BASE_URL = __BUILD_ARGS__.baseUrl

/**
 * Base path of the router (i.e. the `basename` property).
 */
export const BASE_PATH = __BUILD_ARGS__.basePath

/**
 * Default locale.
 */
export const DEFAULT_LOCALE = 'en'

/**
 * Location in the URL to infer the current locale, available options are
 * "path" and "query".
 */
export const LOCALE_CHANGE_STRATEGY = 'path'

/**
 * Port.
 */
export const PORT = Number(typeof process !== 'undefined' && process.env.PORT || 8080)

/**
 * Specifies whether the creation of the HTTP server should be skipped.
 */
export const SKIP_HTTP = typeof process !== 'undefined' && process.env.SKIP_HTTP === 'true' || false

/**
 * Specifies whether debug is enabled.
 */
export const DEBUG_ENABLED = process.env.NODE_ENV === 'development'

/**
 * Enabled debug channels in the client.
 */
export const DEBUG_CHANNELS = ['app']
