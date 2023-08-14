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
export const APP_NAME = 'React Isomorphic Starter Kit'

/**
 * Fallback app description.
 */
export const APP_DESCRIPTION = 'React isomorphic app starter kit'

/**
 * Value for the `theme-color` meta tag.
 */
export const THEME_COLOR = '#15141a'

/**
 * Value for the `color` attribute of the `mask-icon` meta tag.
 */
export const MASK_ICON_COLOR = '#000'

/**
 * Public path for static assets (with trailing slash if needed).
 */
export const PUBLIC_PATH = __BUILD_ARGS__.publicPath

/**
 * Base URL of the app.
 */
export const BASE_URL = __BUILD_ARGS__.baseURL

/**
 * Base path of the router (i.e. the `basename` property).
 */
export const BASE_PATH = __BUILD_ARGS__.basePath

/**
 * Default locale.
 */
export const DEFAULT_LOCALE = __BUILD_ARGS__.defaultLocale

/**
 * Location in the URL to infer the current locale, available options are "path"
 * and "query".
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
