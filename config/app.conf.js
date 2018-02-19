/**
 * @file Configuration for both client and server environments.
*/

const path = require(`path`);

module.exports = {
  // Current Node environment, defaults to `development` if none specified.
  env: process.env.NODE_ENV || `development`,

  // Current working directory.
  cwd: path.join(__dirname, `../`),

  // Port.
  port: process.env.PORT || 8080,

  // Config options specific to the `build` tas.
  build: {
    // Public path of all loaded assets.
    publicPath: process.env.PUBLIC_PATH || `/`,

    // Specifies whether the linter should run.
    linter: true,

    // Specifies whether a bundle analyzer report should be generated at the end
    // of the build process.
    analyzer: false
  },

  // Config options specific to the `dev` task.
  dev: {
    // Public path of all loaded assets.
    publicPath: `/`,

    // Specifies whether the linter should run.
    linter: false
  }
};