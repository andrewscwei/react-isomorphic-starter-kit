import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router'
import { BASE_URL, DESCRIPTION, TITLE } from '../../app.conf'
import $$AltFaviconDark from '../../ui/assets/meta/favicon-dark.png'
import $$FaviconDark from '../../ui/assets/meta/favicon-dark.svg'
import $$AltFaviconLight from '../../ui/assets/meta/favicon-light.png'
import $$FaviconLight from '../../ui/assets/meta/favicon-light.svg'
import $$OGImage from '../../ui/assets/meta/og-image.png'
import $$PinnedIcon from '../../ui/assets/meta/pinned-icon.svg'
import $$TwitterCard from '../../ui/assets/meta/twitter-card.png'
import { useLocale } from '../providers/I18nProvider'
import joinURL from '../utils/joinURL'

type Props = {
  description?: string
  title?: string
}

export default function Head({
  description,
  title,
}: Props) {
  const pageTitle = title ?? TITLE
  const pageDescription = description ?? DESCRIPTION
  const pageUrl = joinURL(BASE_URL, useLocation().pathname)
  const locale = useLocale()
  const matchMedia = typeof window !== 'undefined' && typeof window.matchMedia !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : undefined
  const [isDarkMode, setIsDarkMode] = useState<boolean>(matchMedia?.matches === true)

  const colorSchemeChangeHandler = (event: MediaQueryListEvent) => setIsDarkMode(event.matches)

  useEffect(() => {
    matchMedia?.addEventListener('change', colorSchemeChangeHandler)

    return () => {
      matchMedia?.removeEventListener('change', colorSchemeChangeHandler)
    }
  }, [])

  return (
    <Helmet htmlAttributes={{ lang: locale }}>
      <link rel='canonical' href={pageUrl}/>
      <link rel='mask-icon' type='image/svg+xml' href={$$PinnedIcon} color={isDarkMode ? '#fff' : '#000'}/>
      <link rel='alternate icon' type='image/png' href={isDarkMode ? $$AltFaviconDark : $$AltFaviconLight}/>
      <link rel='icon' href={isDarkMode ? $$FaviconDark : $$FaviconLight}/>
      <title>{pageTitle}</title>
      <meta name='description' content={pageDescription}/>

      <meta name='theme-color' content='#15141a'/>

      <meta property='og:site_name' content={TITLE}/>
      <meta property='og:title' content={pageTitle}/>
      <meta property='og:description' content={pageDescription}/>
      <meta property='og:locale' content={locale}/>
      <meta property='og:url' content={pageUrl}/>
      <meta property='og:image' content={joinURL(BASE_URL, $$OGImage)}/>
      <meta property='og:image:alt' content={pageDescription}/>

      <meta name='twitter:title' content={pageTitle}/>
      <meta name='twitter:description' content={pageDescription}/>
      <meta name='twitter:image' content={joinURL(BASE_URL, $$TwitterCard)}/>

      <meta name='apple-mobile-web-app-title' content={TITLE}/>
    </Helmet>
  )
}
