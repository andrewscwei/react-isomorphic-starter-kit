/**
 * @file This is the Webpack config for compiling client assets in both
 *       `development` and `production` environments.
*/

const config = require(`./app.conf`);
const path = require(`path`);
const CopyPlugin = require(`copy-webpack-plugin`);
const ExtractTextPlugin = require(`extract-text-webpack-plugin`);
const ManifestPlugin = require(`webpack-manifest-plugin`);
const { BundleAnalyzerPlugin } = require(`webpack-bundle-analyzer`);
const { DefinePlugin, EnvironmentPlugin, HotModuleReplacementPlugin, NoEmitOnErrorsPlugin, optimize: { CommonsChunkPlugin, UglifyJsPlugin } } = require(`webpack`);

// Set Babel environment to use the correct Babel config.
process.env.BABEL_ENV = `client`;

const isDev = process.env.NODE_ENV === `development`;
const cwd = path.join(__dirname, `../`);
const inputDir = path.join(cwd, `src`);
const outputDir = path.join(cwd, `build/public`);

module.exports = {
  target: `web`,
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
    sourceMapFilename: isDev ? `[name].js.map` : `[name].[hash:6].js.map`
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
            sourceMap: true,
            localIdentName: `[hash:6]`
          }
        }, {
          loader: `postcss-loader`,
          options: {
            ident: `postcss`,
            sourceMap: true,
            plugins: (loader) => [
              require(`autoprefixer`)(),
              require(`cssnano`)()
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
      use: `url-loader?limit=10000&name=assets/images/[name]${isDev ? `` : `.[hash:6]`}.[ext]`
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: `url-loader?limit=10000&name=assets/media/[name]${isDev ? `` : `.[hash:6]`}.[ext]`
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: `url-loader?limit=10000&name=assets/fonts/[name]${isDev ? `` : `.[hash:6]`}.[ext]`
    }]
  },
  resolve: {
    extensions: [`.js`, `.jsx`],
    alias: {
      '@': inputDir
    }
  },
  plugins: [
    // Directly copy static files to output directory.
    new CopyPlugin([{
      from: path.join(inputDir, `static`),
      to: outputDir,
      ignore: [`.*`]
    }]),
    // Set runtime environment variables.
    new EnvironmentPlugin({
      NODE_ENV: `production`
    }),
    // Define runtime global variables in JavaScript.
    new DefinePlugin({
      $config: JSON.stringify(config)
    }),
    // Extract common modules into separate bundle.
    new CommonsChunkPlugin({
      name: `common`,
      minChunks: (module) => ((module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.resolve(cwd, `node_modules`)) === 0))
    }),
    // Extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated.
    new CommonsChunkPlugin({
      name: `manifest`,
      chunks: [`common`]
    })
  ]
    .concat(isDev ? [
      new HotModuleReplacementPlugin(),
      new NoEmitOnErrorsPlugin()
    ] : [
      new ExtractTextPlugin({
        filename: `bundle.[contenthash].css`,
        allChunks: true
      }),
      new UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new ManifestPlugin({
        fileName: `asset-manifest.json`
      })
    ])
    .concat((!isDev && config.build.analyzer) ? [
      new BundleAnalyzerPlugin()
    ] : [])
};