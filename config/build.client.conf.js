/**
 * @file This is the Webpack config for compiling client assets in both
 *       `development` and `production` environments.
*/

const config = require(`./app.conf`);
const path = require(`path`);
const webpack = require(`webpack`);
const CopyPlugin = require(`copy-webpack-plugin`);
const ExtractTextPlugin = require(`extract-text-webpack-plugin`);
const OptimizeCSSPlugin = require(`optimize-css-assets-webpack-plugin`);
const { BundleAnalyzerPlugin } = require(`webpack-bundle-analyzer`);

const isDev = config.env === `development`;
const inputDir = path.join(config.cwd, `src`);
const outputDir = path.join(config.cwd, `build/public`);

process.env.BABEL_ENV = `client`;

module.exports = {
  devtool: isDev ? `cheap-eval-source-map` : false,
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },
  entry: {
    bundle: (function() {
      const p = path.join(inputDir, `client.jsx`);
      return isDev ? [`react-hot-loader/patch`, `webpack-hot-middleware/client?reload=true`, p] : p;
    })()
  },
  output: {
    path: outputDir,
    publicPath: isDev ? `/` : config.build.publicPath,
    filename: isDev ? `[name].js` : `[name].[chunkhash].js`,
    chunkFilename: isDev ? `[chunkhash].js` : `[id].[chunkhash].js`,
    sourceMapFilename: isDev ? `[name].map` : `[name].[hash:6].map`
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      use: `babel-loader`,
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      use: (function() {
        const t = [{
          loader: `css-loader`,
          options: {
            modules: true,
            localIdentName: `[hash:6]`,
            sourceMap: isDev
          }
        }, {
          loader: `postcss-loader`,
          options: {
            plugins: (loader) => [
              require(`autoprefixer`)()
            ]
          }
        }];

        return isDev ? [`style-loader`].concat(t) : ExtractTextPlugin.extract({
          fallback: `style-loader`,
          use: t
        });
      })()
    }, {
      test: /\.(jpe?g|png|gif|svg|ico)(\?.*)?$/,
      use: {
        loader: `url-loader`,
        options: {
          limit: 10000,
          name: path.join(outputDir, `assets/images`, isDev ? `[name].[ext]` : `[name].[hash:6].[ext]`)
        }
      }
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: {
        loader: `url-loader`,
        options: {
          limit: 10000,
          name: path.join(outputDir, `assets/media`, isDev ? `[name].[ext]` : `[name].[hash:6].[ext]`)
        }
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: {
        loader: `url-loader`,
        options: {
          limit: 10000,
          name: path.join(outputDir, `assets/fonts`, isDev ? `[name].[ext]` : `[name].[hash:6].[ext]`)
        }
      }
    }]
  },
  resolve: {
    extensions: [`.js`, `.jsx`],
    alias: {
      '@': inputDir
    },
    modules: [
      path.join(config.cwd, `node_modules`)
    ]
  },
  plugins: [
    new CopyPlugin([{ from: path.join(inputDir, `static`), to: outputDir, ignore: [`.*`] }]),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(config.env) },
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
    .concat(isDev ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ] : [
      new ExtractTextPlugin({
        filename: isDev ? `styles.css` : `styles.[contenthash].css`
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