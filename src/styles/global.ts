import { css } from 'styled-components'
import normalize from 'styled-normalize'
import * as theme from './theme'

export default css`
  /* stylelint-disable-next-line max-empty-lines */
  ${normalize}

  html,
  body {
    background: ${theme.colors.background};
    font-family: ${theme.fonts.body};
    height: 100%;
    width: 100%;
  }
`
