/**
 * @file Application config.
 */

/** Build args */
export const BASE_PATH = import.meta.env.BASE_PATH
export const BASE_URL = import.meta.env.BASE_URL
export const BUILD_TIME = import.meta.env.BUILD_TIME
export const DEV = import.meta.env.DEV
export const DEBUG_MODE = !!import.meta.env.DEBUG_MODE
export const DEFAULT_LOCALE = import.meta.env.DEFAULT_LOCALE
export const DEFAULT_METADATA = import.meta.env.DEFAULT_METADATA
export const VERSION = `v${import.meta.env.VERSION}+build.${import.meta.env.BUILD_NUMBER}`

/** App config */
