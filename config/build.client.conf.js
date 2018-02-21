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

const isDev = config.env === `development`;
const inputDir = path.join(config.cwd, `src`);
const outputDir = path.join(config.cwd, `build/public`);

module.exports = {
  devtool: isDev ? `cheap-eval-source-map` : false,
  context: inputDir,
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },
  entry: {
    bundle: isDev ? [`react-hot-loader/patch`, `webpack-hot-middleware/client?reload=true`, `./client.jsx`] : `./client.jsx`
  },
  output: {
    path: outputDir,
    publicPath: isDev ? `/` : config.build.publicPath,
    filename: isDev ? `[name].js` : `[name].[chunkhash].js`,
    chunkFilename: isDev ? `[chunkhash].js` : `[id].[chunkhash].js`,
    sourceMapFilename: isDev ? `[name].map` : `[name].[hash].map`
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: `babel-loader`,
      exclude: /node_modules/
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
      }
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
    .concat(isDev ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ] : [
      new ExtractTextPlugin({
        filename: path.join(outputDir, `stylesheets`, `[name].[contenthash].css`)
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
    .concat((!isDev && config.build.analyzer) ? [
      new BundleAnalyzerPlugin()
    ] : [])
};