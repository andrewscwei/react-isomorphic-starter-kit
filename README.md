# React Isomorphic Starter Kit [![CircleCI](https://img.shields.io/circleci/build/github/andrewscwei/react-isomorphic-starter-kit.svg)](https://circleci.com/gh/andrewscwei/react-isomorphic-starter-kit)

This is an **experimental** starter kit for a React universal/isomorphic app.

## Features

1. Server-side rendering (in production) with [Express](https://expressjs.com/)
2. Hot module replacement (in development)
3. [Babel](https://babeljs.io/)
4. [React Router](https://reacttraining.com/react-router/)
5. [Redux](https://redux.js.org/introduction)
6. [Polyglot](http://airbnb.io/polyglot.js/)
7. [Styled Components](https://www.styled-components.com/)
8. [React Transition Group](http://reactcommunity.org/react-transition-group/)
9. [nodemon](https://github.com/remy/nodemon)
10. [Docker](https://docker.com) config
11. [ESLint](https://eslint.org/) and [StyleLint](https://stylelint.io/) config
12. [CircleCI](https://circleci.com) setup to deploy to [Heroku](https://heroku.com) container registry

## Usage

```sh
# Install dependencies
$ npm install

# Run in dev
$ npm run dev

# Run in prod
$ npm run build && npm start
```

See `scripts` in `package.json` for additional commands.
