/**
 * @file Runtime application config.
 */

/**
 * Full version string.
 */
export const VERSION = __BUILD_ARGS__.version

/**
 * Fallback app title.
 */
export const TITLE = 'React Isomorphic Starter Kit'

/**
 * Fallback app description.
 */
export const DESCRIPTION = 'React isomorphic app starter kit'

/**
 * Value for the `theme-color` meta tag.
 */
export const THEME_COLOR = '#15141a'

/**
 * Value for the `color` attribute of the `mask-icon` meta tag.
 */
export const MASK_ICON_COLOR = '#000'

/**
 * Base URL of the app.
 */
export const BASE_URL = __BUILD_ARGS__.baseURL

/**
 * Base path of the router (i.e. the `basename` property).
 */
export const BASE_PATH = __BUILD_ARGS__.basePath

/**
 * Absolute public URL for static assets.
 */
export const PUBLIC_URL = __BUILD_ARGS__.publicURL

/**
 * Public path for static assets.
 */
export const PUBLIC_PATH = __BUILD_ARGS__.publicPath

/**
 * Port.
 */
export const PORT = Number(typeof process !== 'undefined' && process.env.PORT || 8080)
