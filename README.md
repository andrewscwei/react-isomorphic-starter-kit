# React Isomorphic Starter Kit [![CI](https://github.com/andrewscwei/react-isomorphic-starter-kit/workflows/CI/badge.svg)](https://github.com/andrewscwei/react-isomorphic-starter-kit/actions?query=workflow%3ACI) [![CD](https://github.com/andrewscwei/react-isomorphic-starter-kit/workflows/CD/badge.svg)](https://github.com/andrewscwei/react-isomorphic-starter-kit/actions?query=workflow%3ACD)

This is an **experimental** starter kit for a React universal/isomorphic app.

## Features

1. Server-side rendering (in production) with [Express](https://expressjs.com/)
2. Hot module replacement (in development)
3. [TypeScript](https://www.typescriptlang.org/)
4. [React Router](https://reacttraining.com/react-router/)
5. [Redux](https://redux.js.org/introduction)
6. [Polyglot](http://airbnb.io/polyglot.js/)
7. [Styled Components](https://www.styled-components.com/)
8. [React Transition Group](http://reactcommunity.org/react-transition-group/)
9. [nodemon](https://github.com/remy/nodemon)
10. [Docker](https://docker.com) config
11. [ESLint](https://eslint.org/) and [StyleLint](https://stylelint.io/) config
12. [GitHub Actions](https://github.com/features/actions) setup to deploy to [Heroku](https://heroku.com) container registry

## Usage

```sh
# Install dependencies
$ npm install

# Run in development
$ npm run dev

# Build for production
$ npm run build

# Run in production (after successful build)
$ npm start
```

In any of the `build` or `build:*` scripts, you can add the following arguments for additional diagnosis details of the build process:

```sh
# Analyzes the size the generated bundle(s) and displays a visual report in the default browser
$ npm run build --analyze

# Measures the speed of the build pipeline and outputs a repot to console
$ npm run build --speed
```

See `scripts` in `package.json` for additional commands.

## Testing

Tests are executed directly from the `tests/` directory in TypeScript and requires the app to have already been built (i.e. `build/` directory is not empty).

```sh
$ npm test
```

## Docker

Building a containerized version of the app using the included `Dockerfile`:

```sh
# Build the image with required environment variables
$ npm run ship:build

# Build and run the image with required environment variables
$ npm run ship:run
```
