import { useMeta } from '@lib/dom/useMeta.js'
import { useLocale } from '@lib/i18n/useLocale.js'
import { useLocalizedString } from '@lib/i18n/useLocalizedString.js'
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
