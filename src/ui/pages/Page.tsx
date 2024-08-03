import { useMeta } from '@lib/dom/useMeta.js'
import { useLocale, useLocalizedString } from '@lib/i18n/index.js'
import { Outlet } from 'react-router'
import { Footer } from '../components/Footer.js'
import { Header } from '../components/Header.js'

export function Component() {
  const ltxt = useLocalizedString()
  const locale = useLocale()

  useMeta({
    description: ltxt('description'),
    locale,
  })

  return (
    <>
      <Header/>
      <Outlet/>
      <Footer/>
    </>
  )
}
