/**
 * @file This is the Webpack config for compiling client assets in both
 *       `development` and `production` environments.
*/

const config = require(`./app.conf`);
const path = require(`path`);
const webpack = require(`webpack`);
const ExtractTextPlugin = require(`extract-text-webpack-plugin`);
const OptimizeCSSPlugin = require(`optimize-css-assets-webpack-plugin`);
const { BundleAnalyzerPlugin } = require(`webpack-bundle-analyzer`);

const IS_DEV = config.env === `development`;
const INPUT_DIR = path.join(config.cwd, `src/client`);
const OUTPUT_DIR = path.join(config.cwd, `build/public`);

module.exports = {
  devtool: IS_DEV ? `cheap-eval-source-map` : false,
  context: path.join(config.cwd, `src/client`),
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },
  entry: IS_DEV ? [`react-hot-loader/patch`, `webpack-hot-middleware/client?quiet=true`, `./index.jsx`] : `./index.jsx`,
  output: {
    path: OUTPUT_DIR,
    publicPath: IS_DEV ? `/` : config.build.publicPath,
    filename: IS_DEV ? `[name].js` : path.posix.join(`javascripts`, `[name].[chunkhash].js`),
    chunkFilename: IS_DEV ? `[chunkhash].js` : path.posix.join(`javascripts`, `[id].[chunkhash].js`),
    sourceMapFilename: IS_DEV ? `[name].map` : path.posix.join(`javascripts`, `[name].[hash].map`)
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: `babel-loader`
    }]
  },
  resolve: {
    extensions: [`.js`, `.jsx`],
    modules: [
      path.join(config.cwd, `node_modules`)
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(config.env)
      },
      $config: JSON.stringify(config)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: `common`,
      minChunks: (module) => {
        return (module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.resolve(config.cwd, `node_modules`)) === 0);
      }
    }),
    // Extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated.
    new webpack.optimize.CommonsChunkPlugin({
      name: `manifest`,
      chunks: [`common`]
    })
  ]
    .concat(IS_DEV ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ] : [
      new ExtractTextPlugin({
        filename: path.join(OUTPUT_DIR, `stylesheets`, `[name].[contenthash].css`)
      }),
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          safe: true
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ])
    .concat((!IS_DEV && config.build.analyzer) ? [
      new BundleAnalyzerPlugin()
    ] : [])
};