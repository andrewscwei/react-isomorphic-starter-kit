const path = require(`path`);

const BUILD_DIR = path.join(__dirname, `../`, `public`);

module.exports = {
  entry: `./client/app.jsx`,

  output: {
    filename: `app.js`,
    path: path.join(BUILD_DIR, `javascripts`)
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: `babel-loader`
      }
    ]
  }
};