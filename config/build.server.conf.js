/**
 * @file This is the Webpack config for compiling client assets in both
 *       `development` and `production` environments.
*/

const config = require(`./app.conf`);
const nodeExternals = require(`webpack-node-externals`);
const path = require(`path`);
const { BannerPlugin, DefinePlugin, optimize: { UglifyJsPlugin } } = require(`webpack`);

process.env.BABEL_ENV = `server`;

// Fetch the asset manifest file if it exists.
let manifest = undefined;

try {
  manifest = require(path.join(config.paths.output, `public`, config.assetManifestFileName));
}
catch (err) {
  console.warn(`No asset manifest file found: ${err.message}`); // eslint-disable-line no-console
}

module.exports = {
  target: `node`,
  devtool: `source-map`,
  externals: [nodeExternals()],
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },
  node: {
    __dirname: false,
    __filename: false
  },
  entry: {
    server: path.join(config.paths.input, `server.jsx`)
  },
  output: {
    path: path.join(config.paths.output),
    filename: `[name].js`,
    sourceMapFilename: `[name].js.map`,
    libraryTarget: `commonjs2`
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      use: `babel-loader`,
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      use: `css-loader/locals`
    }, {
      test: /\.(jpe?g|png|gif|svg|ico|mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf)(\?.*)?$/,
      use: `url-loader?emitFile=false`
    }]
  },
  resolve: {
    extensions: [`.js`, `.jsx`],
    alias: {
      '@': config.paths.input
    }
  },
  plugins: [
    new DefinePlugin({
      $config: JSON.stringify(config),
      $manifest: JSON.stringify(manifest)
    }),
    // new UglifyJsPlugin({
    //   sourceMap: true,
    //   compress: {
    //     warnings: false
    //   }
    // }),
    new BannerPlugin({
      banner: `require('source-map-support').install()`,
      raw: true,
      entryOnly: false
    })
  ]
};