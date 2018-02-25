/**
 * @file This is the Webpack config for compiling client assets in both
 *       `development` and `production` environments.
*/

const fs = require(`fs`);
const nodeExternals = require(`webpack-node-externals`);
const path = require(`path`);
const CopyPlugin = require(`copy-webpack-plugin`);
const { BannerPlugin, EnvironmentPlugin, DefinePlugin, optimize: { UglifyJsPlugin } } = require(`webpack`);

// Set Babel environment to use the correct Babel config.
process.env.BABEL_ENV = `server`;

const cwd = path.join(__dirname, `../`);
const inputDir = path.join(cwd, `src`);
const outputDir = path.join(cwd, `build`);

// Process asset manifest file if it exists.
let manifest = undefined;
try {
  manifest = require(path.join(outputDir, `public`, `asset-manifest.json`));
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
    server: path.join(inputDir, `server.jsx`)
  },
  output: {
    path: outputDir,
    filename: `[name].js`,
    sourceMapFilename: `[name].js.map`
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
      '@': inputDir
    }
  },
  plugins: [
    new CopyPlugin([{
      from: path.join(cwd, `config`),
      to: path.join(outputDir, `config`),
      ignore: [`.*`, `*.conf.js`, `*.conf.json`]
    }]),
    new EnvironmentPlugin({
      NODE_ENV: `production`
    }),
    new DefinePlugin({
      $manifest: JSON.stringify(manifest)
    }),
    new UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new BannerPlugin({
      banner: `require('source-map-support').install()`,
      raw: true,
      entryOnly: false
    })
  ]
};