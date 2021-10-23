import * as theme from '../styles/theme'

type Theme = typeof theme

declare module 'styled-components' {
  interface DefaultTheme extends Theme {}
}
