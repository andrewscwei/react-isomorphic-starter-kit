/**
 * @file This is the Webpack config for compiling client assets in both
 *       `development` and `production` environments.
*/

const config = require(`./app.conf`);
const fs = require(`fs`);
const nodeExternals = require(`webpack-node-externals`);
const path = require(`path`);
const { BannerPlugin, DefinePlugin, optimize: { UglifyJsPlugin } } = require(`webpack`);

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

// Process locales.
const locales = fs.readdirSync(path.join(__dirname, `locales`)).filter(v => !(/(^|\/)\.[^/.]/g).test(v)).map(val => path.basename(val, `.json`));
const translations = locales.reduce((obj, val) => {
  obj[val] = { translations: { common: require(path.join(__dirname, `locales`, val)) } };
  return obj;
}, {});

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
      '@': inputDir
    }
  },
  plugins: [
    new DefinePlugin({
      $manifest: JSON.stringify(manifest)
    }),
    new UglifyJsPlugin({
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