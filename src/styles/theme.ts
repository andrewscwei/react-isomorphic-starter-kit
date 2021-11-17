import { css } from 'styled-components'

export const colors = {
  background: '#0f0e13',
  white: '#fff',
  grey: '#666',
  black: '#111',
}

export const fonts = {
  header: 'Roboto, sans-serif',
  body: 'Roboto, sans-serif',
  mono: 'monospace',
}

export const layout = {
  hp: css`
    padding-left: 5%;
    padding-right: 5%;
  `,
}

export const texts = {
  h1: css`
    font-family: ${fonts.header};
    font-size: 5em;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    `,
  h2: css`
    font-family: ${fonts.header};
    font-size: 2.4em;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
  `,
  p1: css`
    font-family: ${fonts.body};
    font-size: 1em;
    font-weight: 400;
    letter-spacing: .6px;
    line-height: 1.6em;
  `,
  m1: css`
    font-family: ${fonts.mono};
    font-size: 1.2em;
    font-weight: 400;
    letter-spacing: .6px;
    line-height: 1.6em;
  `,
  n1: css`
    font-family: ${fonts.body};
    font-size: .8em;
    font-weight: 400;
    letter-spacing: 1px;
    text-decoration: none;
    text-transform: uppercase;
  `,
  n2: css`
    font-family: ${fonts.body};
    font-size: .8em;
    text-decoration: none;
  `,
}
