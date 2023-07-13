# React Isomorphic Starter Kit [![CI](https://github.com/andrewscwei/react-isomorphic-starter-kit/workflows/CI/badge.svg)](https://github.com/andrewscwei/react-isomorphic-starter-kit/actions?query=workflow%3ACI) [![CD](https://github.com/andrewscwei/react-isomorphic-starter-kit/workflows/CD/badge.svg)](https://github.com/andrewscwei/react-isomorphic-starter-kit/actions?query=workflow%3ACD)

This is an **experimental** starter kit for a React universal/isomorphic app.

## Features

1. [React Router](https://reacttraining.com/react-router/)
2. [Polyglot](http://airbnb.io/polyglot.js/)
3. [CSS Modules](https://github.com/css-modules/css-modules) + [PostCSS](https://postcss.org/) + [PurgeCSS](https://purgecss.com/) + [StyleLint](https://stylelint.io/)
4. [TypeScript](https://www.typescriptlang.org/) + [Babel](https://babeljs.io/) + [ESLint](https://eslint.org/)
5. [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/)
6. [webpack](https://webpack.js.org/)
7. [Docker](https://docker.com) config
8. [nodemon](https://github.com/remy/nodemon) + Hot module replacement (in development)
9. Server-side rendering with [Express](https://expressjs.com/) or exporting as static site
10. Data prefetching and caching
11. Web workers
12. CI/CD workflows with [GitHub Actions](https://github.com/features/actions)

## Usage

```sh
# Install dependencies
$ npm install

# Run in development
$ npm run dev

# Run production tests
$ npm test

# Run tests in specific dir relative to src
$ npm test --files=dir

# Run unit tests
$ npm run test:ts

# Build for production
$ npm run build

# Run in production (after successful build)
$ npm start
```

In any of the `build` or `build:*` scripts, you can add the following arguments for additional diagnosis details of the build process:

```sh
# Analyzes the size the generated bundle(s) and displays a visual report in the default browser
$ npm run build --analyze

# Omits HTML/CSS/JS compressions during build
$ npm run build --raw
```

See `scripts` in `package.json` for additional commands.

## Exporting as Static Site

To export this app as a static site, run `npm run export` after a successful build. This will remove all server components from the built app and generate static HTML files for all pages outlined in the `/sitemap.xml` endpoint.

## Testing

Unit tests reside in `/src` and can be ran via:

```sh
$ npm run test:ts
```

Integration tests are executed directly from the `tests/` directory in TypeScript and requires the app to have already been built (i.e. `build/` directory is not empty):

```sh
$ npm test
```

## Docker

Building a containerized version of the app using the included `Dockerfile`:

```sh
# Build the image
$ npm run ship:build

# Run the image
$ npm run ship:run
```

## Using as Repository Template

When using `react-isomorphic-starter-kit` as a template, follow these steps to strip placeholder content:

1. Replace `LICENSE` file
2. Edit `README.md`
3. Edit fields in `package.json`
4. Edit fields in `src/app.conf.ts`
5. Edit resources in `res/`, then ensure to replace the generated assets in the following places:
    1. `src/ui/assets/meta/`
    2. `src/static/`
6. Edit files in `src/ui/components/` and `src/ui/pages/`
7. Edit translations in `src/locales/`

## Breaking Changes

### `v10.0.0`

- Removed styled-components in favor of CSS modules
- Removed Redux in favor of Context API
- Updated how assets are imported
- Relocated `locales` directory
- Created reusable workflows for CI/CD
- Added interactors
- Added `I18nProvider`

### `v12.0.0`

- Decoupled boilerplate architectural code to `src/base`
