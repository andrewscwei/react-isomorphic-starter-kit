import { css } from 'styled-components'
import normalize from 'styled-normalize'
import * as theme from './theme'

export default css`
  /* stylelint-disable-next-line max-empty-lines */
  ${normalize}

  @font-face {
    font-family: 'Roboto';
    src: url('/static/fonts/Roboto-Bold.ttf') format('truetype');
    font-style: normal;
    font-weight: 700;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/static/fonts/Roboto-Regular.ttf') format('truetype');
    font-style: normal;
    font-weight: 400;
  }

  @font-face {
    font-family: 'Roboto';
    src: url('/static/fonts/Roboto-Light.ttf') format('truetype');
    font-style: normal;
    font-weight: 300;
  }

  html,
  body {
    background: ${theme.colors.background};
    font-family: ${theme.fonts.body};
    height: 100%;
    width: 100%;
  }
`
