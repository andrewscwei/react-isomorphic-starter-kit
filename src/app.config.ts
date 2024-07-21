/**
 * @file Application config.
 */

const env = typeof import.meta.env !== 'undefined' ? import.meta.env : process.env as ImportMetaEnv

/** URL of the app. */
export const BASE_URL = env.BASE_URL

/** Base path of the router (i.e. the `basename` property). */
export const BASE_PATH = env.BASE_PATH

/** App version. */
export const VERSION = `v${env.VERSION}+build.${env.BUILD_NUMBER}`

/** Default locale. */
export const DEFAULT_LOCALE = env.VITE_DEFAULT_LOCALE ?? 'en'

/** Default metadata. */
export const METADATA = {
  baseTitle: 'React Isomorphic Starter Kit',
  description: 'React isomorphic app starter kit',
  maskIconColor: '#000',
  themeColor: '#15141a',
  title: 'React Isomorphic Starter Kit',
}
