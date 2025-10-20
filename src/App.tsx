import { StrictMode, type PropsWithChildren } from 'react'
import './styles/theme.css'

type Props = PropsWithChildren

export function App({ children }: Readonly<Props>) {
  return (
    <StrictMode>
      {children}
    </StrictMode>
  )
}
