/**
 * @file Client app root.
 */

import React, { PropsWithChildren, StrictMode } from 'react'
import { useFavicon, useThemeColor } from '../../lib/dom'
import { joinURL } from '../../lib/utils'
import { MASK_ICON_COLOR, PUBLIC_PATH, THEME_COLOR } from '../app.conf'
import './styles/global.css'
import './styles/theme.css'

type Props = PropsWithChildren

export default function App({ children }: Props) {
  useThemeColor(THEME_COLOR)

  useFavicon({
    maskIcon: {
      color: MASK_ICON_COLOR,
    },
    icon: {
      darkImage: joinURL(PUBLIC_PATH, 'favicon-dark.svg'),
    },
    alternateIcon: {
      darkImage: joinURL(PUBLIC_PATH, 'favicon-dark.png'),
    },
  })

  return (
    <StrictMode>
      {children}
    </StrictMode>
  )
}
