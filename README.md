# React Isomorphic Starter Kit [![CD](https://github.com/andrewscwei/react-isomorphic-starter-kit/workflows/CD/badge.svg)](https://github.com/andrewscwei/react-isomorphic-starter-kit/actions?query=workflow%3ACD)

> Live example on [GitHub Pages (static site generation)](https://andrewscwei.github.io/react-isomorphic-starter-kit/) and [Cloudflare Pages (edge-side rendering)](https://react-isomorphic-starter-kit.pages.dev/)

This is an **experimental** starter kit for a React universal/isomorphic app.

## Features

1. [React Router](https://reacttraining.com/react-router/)
2. [PostCSS](https://postcss.org/) + [StyleLint](https://stylelint.io/)
3. [TypeScript](https://www.typescriptlang.org/) + [ESLint](https://eslint.org/)
4. [Vite](https://vitejs.dev/)
5. [Vitest](https://vitest.dev/)/[React Testing Library](https://testing-library.com/docs/react-testing-library/) for unit testing
6. [Playwright](https://playwright.dev/) for E2E testing
7. [Docker](https://docker.com) config
8. Custom i18n solution using [`sprintf-js`](https://www.npmjs.com/package/sprintf-js)
9. Building for [Express](https://expressjs.com/) with server-side rendering
10. Building for [Cloudflare Pages](https://pages.cloudflare.com/) with edge-side rending
11. Building for a static app with prerendering (example on [GitHub Pages](https://andrewscwei.github.io/react-isomorphic-starter-kit/))
12. Web workers
13. CI/CD workflows with [GitHub Actions](https://github.com/features/actions)

## Usage

```sh
# Install pre-commit
$ brew install pre-commit # or pip install pre-commit

# Install Playwright browsers
$ npx playwright install

# Install dependencies
$ npm install

# Run in development (client only)
$ npm run dev:static

# Run unit tests
$ npm run unit
```

In any of the `build` or `build:*` scripts, you can add the following arguments for additional diagnosis details of the build process:

```sh
# Omits HTML/CSS/JS compressions during build
$ npm run build:server --raw
```

See `scripts` in `package.json` for additional commands.

## Building as Express app

This is the default behavior, simply run:

```sh
$ npm run build
```

You can then test it locally:

```sh
$ npm start
```

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
$ npm run unit
```

End-to-end tests are executed directly from the `tests/` directory in TypeScript and requires the app to have already been built (i.e. `build/` directory is not empty):

```sh
$ npm test
```

## Docker

Building a containerized version of the app using the included `Dockerfile`:

```sh
# Build the image
$ npm run ship:build

# Run the image
$ npm run ship
```

## Using as Repository Template

When using `react-isomorphic-starter-kit` as a template, follow these steps to strip placeholder content:

1. Replace `LICENSE` file
2. Edit `README.md`
3. Edit fields in `package.json`
4. Edit fields in `src/app.config.ts`
5. Edit resources in `res/`, then ensure to replace the generated assets in `src/static/`
6. Edit files in `src/ui/`
7. Edit translations in `src/locales/`
