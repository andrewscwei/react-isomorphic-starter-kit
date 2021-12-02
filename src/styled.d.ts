import * as theme from './styles/theme'
import type {} from 'styled-components/cssprop'

// Supports typing for Styled Components theme.
type Theme = typeof theme

declare module 'styled-components' {
  interface DefaultTheme extends Theme {}
}
