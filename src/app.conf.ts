/**
 * @file Default global config of the entire app. Most of these config are
 *       derived from environment variables.
 */

export default {
  // Port.
  port: process.env.PORT || 8080,

  // Determines whether SSR is enabled.
  ssrEnabled: process.env.NODE_ENV !== 'development',
};
