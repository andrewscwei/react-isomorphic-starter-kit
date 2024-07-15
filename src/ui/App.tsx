import { useFavicon } from '@lib/dom/index.js'
import { joinURL } from '@lib/utils/joinURL.js'
import { StrictMode, type PropsWithChildren } from 'react'
import { BASE_URL, MASK_ICON_COLOR } from '../app.conf.js'
import './styles/global.css'
import './styles/theme.css'

type Props = PropsWithChildren

export function App({ children }: Readonly<Props>) {
  useFavicon({
    maskIcon: {
      color: MASK_ICON_COLOR,
    },
    icon: {
      darkImage: joinURL(BASE_URL, 'favicon-dark.svg'),
    },
    alternateIcon: {
      darkImage: joinURL(BASE_URL, 'favicon-dark.png'),
    },
  })

  return (
    <StrictMode>
      {children}
    </StrictMode>
  )
}
