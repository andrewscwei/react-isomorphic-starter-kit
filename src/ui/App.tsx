import { useFavicon } from '@lib/dom/index.js'
import { joinURL } from '@lib/utils/joinURL.js'
import { StrictMode, type PropsWithChildren } from 'react'
import { BASE_PATH } from '../app.config.js'
import './styles/styles.css'

type Props = PropsWithChildren

export function App({ children }: Readonly<Props>) {
  useFavicon({
    icon: {
      darkImage: joinURL(BASE_PATH, 'favicon-dark.svg'),
    },
    alternateIcon: {
      darkImage: joinURL(BASE_PATH, 'favicon-dark.png'),
    },
  })

  return (
    <StrictMode>
      {children}
    </StrictMode>
  )
}
