# React Isomorphic Starter Kit [![CI](https://github.com/andrewscwei/react-isomorphic-starter-kit/workflows/CI/badge.svg)](https://github.com/andrewscwei/react-isomorphic-starter-kit/actions?query=workflow%3ACI) [![CD](https://github.com/andrewscwei/react-isomorphic-starter-kit/workflows/CD/badge.svg)](https://github.com/andrewscwei/react-isomorphic-starter-kit/actions?query=workflow%3ACD)

This is an **experimental** starter kit for a React universal/isomorphic app.

## Features

1. [React Router](https://reacttraining.com/react-router/)
2. [CSS Modules](https://github.com/css-modules/css-modules) + [PostCSS](https://postcss.org/) + [PurgeCSS](https://purgecss.com/) + [StyleLint](https://stylelint.io/)
3. [TypeScript](https://www.typescriptlang.org/) + [Babel](https://babeljs.io/) + [ESLint](https://eslint.org/)
4. [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/)
5. [webpack](https://webpack.js.org/)
6. [Docker](https://docker.com) config
7. [nodemon](https://github.com/remy/nodemon) + Hot module replacement (in development)
8. Custom i18n solution using [`sprintf-js`](https://www.npmjs.com/package/sprintf-js)
9. Building for [Express](https://expressjs.com/) with server-side rendering
10. Building for [Cloudflare Pages](https://pages.cloudflare.com/) with edge-side rending
11. Building for a static app with prerendering (example on GitHub Pages)
12. Data prefetching and caching
13. Web workers
14. CI/CD workflows with [GitHub Actions](https://github.com/features/actions)

## Usage

```sh
# Install dependencies
$ npm install

# Run in development
$ npm run dev

# Run production tests (Express app)
$ npm test

# Run tests in specific dir relative to src
$ npm test --files=dir

# Run unit tests
$ npm run test:ts

# Build for production (Express app)
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

## Exporting as Edge-Rendered Site

To build for Edge, run:

```sh
$ npm run build:edge
```

You can then test it on Cloudflare:

```sh
$ npm run start:edge
```

## Exporting as Static Site

To export this app as a static site, run:

```sh
$ npm run build:static
```

This removes all server components from the built server app and generates static HTML files for all pages outlined in the `/sitemap.xml` endpoint.

To test, run:

```sh
$ npm run start:static
```

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
5. Edit resources in `res/`, then ensure to replace the generated assets in `src/static/`
6. Edit files in `src/ui/`
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

### `v13.0.0`

- Restructured folders

### `v14.0.0`

- Moved boilerplate code to `lib/`
- Replaced `react-helmet-async` with custom solution in `lib/`
