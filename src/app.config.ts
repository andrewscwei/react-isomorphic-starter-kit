/**
 * @file Application config.
 */

/** Build args */
export const BASE_PATH = import.meta.env.BASE_PATH
export const BASE_URL = import.meta.env.BASE_URL
export const BUILD_TIME = import.meta.env.BUILD_TIME
export const DEBUG = import.meta.env.DEBUG
export const DEFAULT_LOCALE = import.meta.env.DEFAULT_LOCALE

/** App config */
export const VERSION = `v${import.meta.env.VERSION}+build.${import.meta.env.BUILD_NUMBER.slice(0, 7)}`
