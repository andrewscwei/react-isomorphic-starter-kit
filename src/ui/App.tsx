/**
 * @file Client app root.
 */

import React, { PropsWithChildren, StrictMode } from 'react'
import { useFavicon } from '../../lib/dom'
import { joinURL } from '../../lib/utils'
import { PUBLIC_PATH } from '../app.conf'
import './styles/global.css'
import './styles/theme.css'

type Props = PropsWithChildren

export default function App({ children }: Props) {
  useFavicon({
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
