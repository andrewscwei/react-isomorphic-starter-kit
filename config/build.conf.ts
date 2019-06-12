/**
 * @file Buildtime configuration for both client and server environments.
 */

import dotenv from 'dotenv';

dotenv.config();

export default {
  // Version number.
  version: require('../package.json').version,

  // Build number.
  buildNumber: process.env.BUILD_NUMBER || 0,

  // Google Analytics ID (i.e. UA-XXXXXXXX-1)
  ga: undefined,

  // HTML metadata.
  meta: {
    // Title of the app.
    title: 'React Universal Starter Kit',

    // Short description of the app.
    description: require('../package.json').description,

    // Search keywords.
    keywords: require('../package.json').keywords,

    // App URL.
    url: require('../package.json').homepage,
  },

  // Default locale.
  defaultLocale: 'en',

  // Supported locales.
  locales: ['en', 'ja'],

  // Config options specific to the `build` task.
  build: {
    // Public path of all loaded assets.
    publicPath: process.env.PUBLIC_PATH || '/static/',

    // Specifies whether JavaScript and CSS source maps should be generated.
    sourceMap: true,

    // Specifies whether a bundle analyzer report should be generated at the end
    // of the build process.
    analyzer: process.env.ANALYZE_BUNDLE === 'true' ? true : false,
  },
};
