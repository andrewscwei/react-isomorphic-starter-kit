import { BASE_URL } from '@/app.config.js'
import { Footer } from '@/ui/components/Footer.js'
import { useLocale, useLocalizedString } from '@lib/i18n'
import { useMeta, type Metadata } from '@lib/meta'
import { type PropsWithChildren } from 'react'
import { useLocation } from 'react-router'

type Props = PropsWithChildren<{
  metadata?: Metadata
}>

export function Page({
  children,
  metadata = {},
}: Props) {
  const ltxt = useLocalizedString()
  const locale = useLocale()
  const location = useLocation()

  useMeta({
    baseTitle: ltxt('window-title-home'),
    canonicalURL: BASE_URL + location.pathname,
    description: ltxt('description'),
    locale,
    themeColor: '#15141a',
    title: ltxt('window-title-home'),
    ...metadata,
  })

  return (
    <>
      {children}
      <Footer/>
    </>
  )
}
