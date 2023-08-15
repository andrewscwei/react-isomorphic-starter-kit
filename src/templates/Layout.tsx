/**
 * @file Base HTML template for all pages.
 */

import React, { PropsWithChildren } from 'react'
import { joinURL } from '../../lib/utils'
import { APP_DESCRIPTION, APP_NAME, BASE_URL, DEFAULT_LOCALE, MASK_ICON_COLOR, THEME_COLOR } from '../app.conf'

type Props = PropsWithChildren<LayoutComponentProps>

export default function Layout({
  children,
  injectScripts = false,
  metadata = {},
  resolveAssetPath = t => t,
}: Props) {
  const baseTitle = APP_NAME
  const pageDescription = metadata.description ?? APP_DESCRIPTION
  const pageLocale = metadata.locale ?? DEFAULT_LOCALE
  const pageTitle = metadata.title ?? baseTitle
  const pageUrl = metadata.url ?? BASE_URL
  const pageThemeColor = THEME_COLOR
  const pageMaskIconColor = MASK_ICON_COLOR ?? pageThemeColor

  return (
    <html lang={pageLocale}>
      <head>
        <meta charSet='utf-8'/>
        <meta httpEquiv='X-UA-Compatible' content='IE=edge'/>
        <meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=2.0,viewport-fit=cover'/>
        <meta name='description' content={pageDescription}/>
        <meta name='theme-color' content={pageThemeColor}/>

        <title>{pageTitle}</title>

        <link rel='canonical' href={pageUrl}/>
        <link rel='mask-icon' type='image/svg+xml' href={resolveAssetPath('/mask-icon.svg')} color={pageMaskIconColor}/>
        <link rel='alternate icon' type='image/png' href={resolveAssetPath('/favicon.png')}/>
        <link rel='icon' type='image/x-icon' href={resolveAssetPath('/favicon.svg')}/>
        <link rel='icon' href='data:;base64,iVBORw0KGgo='/>

        <meta name='mobile-web-app-capable' content='yes'/>
        <meta name='apple-mobile-web-app-capable' content='yes'/>
        <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent'/>
        <meta name='apple-mobile-web-app-title' content={baseTitle}/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/app-icon-57.png')} sizes='57x57'/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/app-icon-60.png')} sizes='60x60'/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/app-icon-72.png')} sizes='72x72'/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/app-icon-76.png')} sizes='76x76'/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/app-icon-114.png')} sizes='114x114'/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/app-icon-120.png')} sizes='120x120'/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/app-icon-144.png')} sizes='144x144'/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/app-icon-152.png')} sizes='152x152'/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/app-icon-180.png')} sizes='180x180'/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/app-icon-192.png')} sizes='192x192'/>

        <meta property='og:site_name' content={baseTitle}/>
        <meta property='og:type' content='website'/>
        <meta property='og:title' content={pageTitle}/>
        <meta property='og:description' content={pageDescription}/>
        <meta property='og:locale' content={pageLocale}/>
        <meta property='og:url' content={pageUrl}/>
        <meta property='og:image' content={joinURL(BASE_URL, resolveAssetPath('/og-image.png'))}/>
        <meta property='og:image:alt' content={pageDescription}/>

        <meta name='twitter:card' content='summary_large_image'/>
        <meta name='twitter:title' content={pageTitle}/>
        <meta name='twitter:description' content={pageDescription}/>
        <meta name='twitter:image' content={joinURL(BASE_URL, resolveAssetPath('/twitter-card.png'))}/>

        <link rel='manifest' href={resolveAssetPath('/manifest.json')}/>

        {injectScripts && <link rel='stylesheet' href={resolveAssetPath('/common.css')}/>}
        {injectScripts && <link rel='stylesheet' href={resolveAssetPath('/main.css')}/>}

        <script defer type='application/javascript' src={resolveAssetPath('/common.js')}></script>
        <script defer type='application/javascript' src={resolveAssetPath('/main.js')}></script>
      </head>
      <body>
        <div id='root'>
          {children}
        </div>
      </body>
    </html>
  )
}
