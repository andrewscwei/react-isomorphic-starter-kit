/**
 * @file This is the Webpack config for compiling client assets in both
 *       `development` and `production` environments.
 */

const config = require(`./app.conf`);
const path = require(`path`);
const CachedInputFileSystem = require(`enhanced-resolve/lib/CachedInputFileSystem`);
const CopyPlugin = require(`copy-webpack-plugin`);
const ExtractTextPlugin = require(`extract-text-webpack-plugin`);
const ManifestPlugin = require(`webpack-manifest-plugin`);
const NodeJsInputFileSystem = require(`enhanced-resolve/lib/NodeJsInputFileSystem`);
const ResolverFactory = require(`enhanced-resolve/lib/ResolverFactory`);
const StyleLintPlugin = require(`stylelint-webpack-plugin`);
const { BundleAnalyzerPlugin } = require(`webpack-bundle-analyzer`);
const { EnvironmentPlugin, IgnorePlugin, HotModuleReplacementPlugin, NoEmitOnErrorsPlugin, optimize: { CommonsChunkPlugin, UglifyJsPlugin } } = require(`webpack`);

// Set Babel environment to use the correct Babel config.
process.env.BABEL_ENV = `client`;

const isDev = process.env.NODE_ENV === `development`;
const cwd = path.join(__dirname, `../`);
const inputDir = path.join(cwd, `src`);
const outputDir = path.join(cwd, `build/public`);

module.exports = {
  target: `web`,
  devtool: isDev ? `cheap-eval-source-map` : (config.build.sourceMap ? `source-map` : false),
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },
  entry: {
    bundle: (function() {
      const p = path.join(inputDir, `client.jsx`);
      return isDev ? [`webpack-hot-middleware/client?reload=true`, p] : p;
    })()
  },
  output: {
    path: outputDir,
    publicPath: isDev ? `/` : config.build.publicPath,
    filename: isDev ? `[name].js` : `[name].[chunkhash].js`,
    sourceMapFilename: `[file].map`
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      use: `babel-loader`,
      exclude: /node_modules/
    }, {
      test: /\.p?css$/,
      use: (function() {
        const t = [{
          loader: `css-loader`,
          options: {
            modules: true,
            sourceMap: isDev ? true : config.build.sourceMap,
            importLoaders: 1,
            localIdentName: `[hash:6]`
          }
        }, {
          loader: `postcss-loader`,
          options: {
            ident: `postcss`,
            sourceMap: isDev ? true : config.build.sourceMap,
            plugins: () => [
              require(`postcss-import`)({
                resolve(id, basedir) {
                  return ResolverFactory.createResolver({
                    alias: {
                      '@': inputDir
                    },
                    extensions: [`.css`, `.pcss`],
                    useSyncFileSystemCalls: true,
                    fileSystem: new CachedInputFileSystem(new NodeJsInputFileSystem(), 60000)
                  }).resolveSync({}, basedir, id);
                }
              }),
              require(`precss`)({
                stage: 0
              }),
              require(`postcss-hexrgba`)(),
              require(`autoprefixer`)(),
              require(`cssnano`)()
            ]
          }
        }];

        return isDev ? [`style-loader?sourceMap`].concat(t) : ExtractTextPlugin.extract({
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
      .concat((isDev ? config.dev.linter : config.build.linter) ? [{
        test: /\.jsx?$/,
        include: [inputDir],
        enforce: `pre`,
        use: {
          loader: `eslint-loader`,
          options: {
            formatter: require(`eslint-friendly-formatter`)
          }
        }
      }] : [])
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
      new IgnorePlugin(/^.*\/config\/.*$/),
      new ExtractTextPlugin({
        filename: `bundle.[contenthash].css`,
        allChunks: true
      }),
      new UglifyJsPlugin({
        sourceMap: config.build.sourceMap,
        compress: {
          warnings: false
        }
      }),
      new ManifestPlugin({
        fileName: `asset-manifest.json`
      })
    ])
    .concat((isDev && config.dev.linter) || (!isDev && config.build.linter) ? [
      new StyleLintPlugin({
        files: [`**/*.css`, `**/*.pcss`],
        failOnError: false,
        quiet: false
      })
    ] : [])
    .concat((!isDev && config.build.analyzer) ? [
      new BundleAnalyzerPlugin()
    ] : [])
};