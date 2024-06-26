import { useFavicon } from '@lib/dom'
import { joinURL } from '@lib/utils/joinURL'
import { StrictMode, type PropsWithChildren } from 'react'
import './styles/global.css'
import './styles/theme.css'

type Props = PropsWithChildren

const { publicPath } = __BUILD_ARGS__

export function App({ children }: Readonly<Props>) {
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
