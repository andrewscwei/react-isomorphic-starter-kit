/**
 * @file Default global config of the entire app. Most of these config are derived from environment
 *       variables.
 */

import { description, homepage, version } from '../package.json'

export default {
  // Version number.
  version: `${version}${process.env.NODE_ENV !== 'development' ? '' : `-${(process.env.NODE_ENV ?? 'development').substring(0, 3)}`}`,

  // Build number.
  buildNumber: process.env.BUILD_NUMBER ?? 'local',

  // Default locale.
  defaultLocale: 'en',

  // Supported locales.
  locales: ['en', 'jp'],

  // HTML metadata.
  meta: {
    // Fallback default window title.
    title: 'React Isomorphic Starter Kit',

    // Short description of the app.
    description,

    // App URL.
    url: homepage,
  },

  // Port.
  port: process.env.PORT || 8080,

  // Determines whether SSR is enabled.
  ssrEnabled: process.env.NODE_ENV !== 'development',

  // Public path of all loaded assets.
  publicPath: process.env.PUBLIC_PATH || '/static/',
}
