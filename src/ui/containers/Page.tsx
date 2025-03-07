import { useMeta, type Metadata } from '@lib/dom/index.js'
import { useLocale, useLocalizedString } from '@lib/i18n/index.js'
import type { PropsWithChildren } from 'react'
import { useLocation } from 'react-router'
import { joinURL } from '../../../lib/utils/joinURL.js'
import { BASE_URL } from '../../app.config.js'
import { Footer } from '../components/Footer.js'

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
    canonicalURL: joinURL(BASE_URL, location.pathname),
    description: ltxt('description'),
    locale,
    ...metadata,
  })

  return (
    <>
      {children}
      <Footer/>
    </>
  )
}
