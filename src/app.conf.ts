/**
 * @file Runtime server config, passed to the client as a global variable named `__APP_CINFOG__`.
 */

export default {
  // Full version string.
  version: `v${__BUILD_ARGS__.version}${!__BUILD_ARGS__.env || __BUILD_ARGS__.env === 'production' ? '' : `-${__BUILD_ARGS__.env.substring(0, 3)}`} (${__BUILD_ARGS__.buildNumber})`,

  // Default locale.
  defaultLocale: 'en',

  // Supported locales.
  locales: ['en', 'ja'],

  // Fallback window title.
  title: 'React Isomorphic Starter Kit',

  // Fallback app description.
  description: __BUILD_ARGS__.packageDescription,

  // Fallback app URL.
  url: __BUILD_ARGS__.packageHomepage,

  // Port.
  port: Number(typeof process !== 'undefined' && process.env.PORT || 8080),

  // Determines whether SSR is enabled.
  ssrEnabled: __BUILD_ARGS__.env !== 'development',
}
