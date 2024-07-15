/**
 * @file Runtime application config.
 */

const env = typeof import.meta.env !== 'undefined' ? import.meta.env : process.env as ImportMetaEnv

/**
 * Base URL of the app.
 */
export const BASE_URL = env.BASE_URL

/**
 * Base path of the router (i.e. the `basename` property).
 */
export const BASE_PATH = env.BASE_PATH

/**
 * App version.
 */
export const VERSION = `v${env.VERSION}+build.${env.BUILD_NUMBER}`

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
