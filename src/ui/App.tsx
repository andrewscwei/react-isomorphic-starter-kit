import React, { StrictMode, type PropsWithChildren } from 'react'
import { useFavicon } from '../../lib/dom'
import { joinURL } from '../../lib/utils'
import './styles/global.css'
import './styles/theme.css'

type Props = PropsWithChildren

const { publicPath } = __BUILD_ARGS__

export function App({ children }: Props) {
  useFavicon({
    icon: {
      darkImage: joinURL(publicPath, 'favicon-dark.svg'),
    },
    alternateIcon: {
      darkImage: joinURL(publicPath, 'favicon-dark.png'),
    },
  })

  return (
    <StrictMode>
      {children}
    </StrictMode>
  )
}
