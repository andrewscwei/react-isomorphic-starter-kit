# react-universal-starter-kit [![CircleCI](https://circleci.com/gh/andrewscwei/react-universal-starter-kit.svg?style=svg)](https://circleci.com/gh/andrewscwei/react-universal-starter-kit)

This is an **experimental** starter kit for a React universal/isomorphic app. In production, the source code for both server and client sides are compiled by Webpack to resolve asset imports. In development, [nodemon](https://github.com/remy/nodemon) is used along with [`babel-node`](https://babeljs.io/docs/usage/cli/#babel-node) to watch and reload server code while the client is hot reloaded by Webpack.

## Features

1. Server-side rendering (in production) with [Express](https://expressjs.com/)
2. Hot module replacement (in development)
3. ES7 for both client and server code, compiled by Webpack (i.e. `async`/`await`, decorators, class properties, etc.)
4. [React Router 4](https://reacttraining.com/react-router/)
5. [Redux](https://redux.js.org/introduction)
6. [i18next](https://www.i18next.com/)
7. [CSS modules](https://github.com/css-modules/css-modules) + [PostCSS](http://postcss.org/)
8. [nodemon](https://github.com/remy/nodemon)
9. [Docker](https://docker.com) config
10. [ESLint](https://eslint.org/) and [StyleLint](https://stylelint.io/) config

## Usage

```sh
# Install dependencies
$ yarn

# Run in dev
$ npm run dev

# Run in prod
$ npm run build && npm start
```

See `scripts` in `package.json` for additional commands.

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).