/**
 * @file Application config.
 */

/** URL of the app. */
export const BASE_URL = import.meta.env.BASE_URL

/** Base path of the router (i.e. the `basename` property). */
export const BASE_PATH = import.meta.env.BASE_PATH

/** App version. */
export const VERSION = `v${import.meta.env.VERSION}+build.${import.meta.env.BUILD_NUMBER}`

/** Default locale. */
export const DEFAULT_LOCALE = import.meta.env.DEFAULT_LOCALE

/** Default metadata. */
export const DEFAULT_METADATA = import.meta.env.DEFAULT_METADATA
