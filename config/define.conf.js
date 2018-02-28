/**
 * @file Global definitions for `babel-plugin-transform-define`.
 */

let manifest = undefined;

try {
  manifest = require(`../build/public/asset-manifest.json`);
}
catch (err) { /* Do nothing */ }

module.exports = {
  $APP_CONFIG: require(`./app.conf`),
  $ASSET_MANIFEST: manifest
};
