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
8. [nodemon](https://github.com/remy/nodemon)
9. [Docker](https://docker.com) config
10. [Jest](https://jestjs.io/) config
11. [ESLint](https://eslint.org/)
12. [GitHub Actions](https://github.com/features/actions) setup to deploy to [Heroku](https://heroku.com) container registry

## Usage

```sh
# Install dependencies
$ npm install

# Run in development
$ npm run dev

# Build for production
$ npm run build

# Run production tests
$ npm test

# Run unit tests
$ npm run test:ts

# Run in production (after successful build)
$ npm start
```

In any of the `build` or `build:*` scripts, you can add the following arguments for additional diagnosis details of the build process:

```sh
# Analyzes the size the generated bundle(s) and displays a visual report in the default browser
$ npm run build --analyze

# Measures the speed of the build pipeline and outputs a report to console
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

## Repository Template

When creating a new repository using `react-isomorphic-starter-kit` as a template, follow the steps below to remove the original branding:

1. In `/package.json`, edit the fields: `name`, `version`, `description`, `private` and `license`
2. Remove `/LICENSE` file
3. Remove `/RELEASE.md` file
4. Edit `/README.md` to suit your project
5. In `/resources/`, edit the app icon and favicon regenerate the sources
  1. In `/src/static/`, replace the app icon and favicon sources
  2. Update `/src/static/manifest.json`
6. In `/src/app.conf.ts`, edit `meta.title` and `locales` fields
  1. Edit translation files in `/config/locales/` to reflect locale changes
  2. Edit `/src/routes.conf.ts` to reflect locale changes
7. In `/src/components/Footer.tsx`, remove reference to this repository's URL

In terms of configuration and metadata, those were it. The remaining changes are in the individual pages in `/src/containers/` and the assets, components and state containers that they use.
