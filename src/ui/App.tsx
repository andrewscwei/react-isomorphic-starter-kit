import { useFavicon, useThemeColor } from '@lib/dom'
import { joinURL } from '@lib/utils/joinURL'
import { StrictMode, type PropsWithChildren } from 'react'
import { BASE_URL, MASK_ICON_COLOR, THEME_COLOR } from '../app.conf'
import './styles/global.css'
import './styles/theme.css'

type Props = PropsWithChildren

export function App({ children }: Readonly<Props>) {
  useThemeColor(THEME_COLOR)

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
