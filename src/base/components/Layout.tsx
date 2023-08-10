/**
 * @file Base HTML template for all pages.
 */

import React, { createElement } from 'react'
import { StaticRouterProps } from 'react-router-dom/server'
import { BASE_URL, DEFAULT_LOCALE, DESCRIPTION, MASK_ICON_COLOR, THEME_COLOR, TITLE, VERSION } from '../../app.conf'
import joinURL from '../utils/joinURL'

type Props = {
  injectScripts?: boolean
  locale?: string
  locals?: Record<string, any>
  metaTags?: MetaTags
  rootComponent?: RootComponentType<'static'>
  routerProps?: StaticRouterProps
  assetPathResolver?: (path: string) => string
}

export default function Layout({
  injectScripts = false,
  locale,
  locals = {},
  metaTags,
  rootComponent,
  routerProps,
  assetPathResolver = t => t,
}: Props) {
  const baseTitle = TITLE
  const pageDescription = metaTags?.description ?? DESCRIPTION
  const pageLocale = locale ?? DEFAULT_LOCALE
  const pageTitle = metaTags?.title ?? baseTitle
  const pageUrl = joinURL(BASE_URL, routerProps?.location?.toString() ?? '')
  const pageThemeColor = metaTags?.themeColor ?? THEME_COLOR
  const pageMaskIconColor = metaTags?.maskIconColor ?? MASK_ICON_COLOR ?? pageThemeColor

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
        <link rel='mask-icon' type='image/svg+xml' href={assetPathResolver('/mask-icon.svg')} color={pageMaskIconColor}/>
        <link rel='alternate icon' type='image/png' href={assetPathResolver('/favicon.png')}/>
        <link rel='icon' type='image/x-icon' href={assetPathResolver('/favicon.svg')}/>
        <link rel='icon' href='data:;base64,iVBORw0KGgo='/>

        <meta name='mobile-web-app-capable' content='yes'/>
        <meta name='apple-mobile-web-app-capable' content='yes'/>
        <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent'/>
        <meta name='apple-mobile-web-app-title' content={baseTitle}/>
        <link rel='apple-touch-icon' href={assetPathResolver('/app-icon-57.png')} sizes='57x57'/>
        <link rel='apple-touch-icon' href={assetPathResolver('/app-icon-60.png')} sizes='60x60'/>
        <link rel='apple-touch-icon' href={assetPathResolver('/app-icon-72.png')} sizes='72x72'/>
        <link rel='apple-touch-icon' href={assetPathResolver('/app-icon-76.png')} sizes='76x76'/>
        <link rel='apple-touch-icon' href={assetPathResolver('/app-icon-114.png')} sizes='114x114'/>
        <link rel='apple-touch-icon' href={assetPathResolver('/app-icon-120.png')} sizes='120x120'/>
        <link rel='apple-touch-icon' href={assetPathResolver('/app-icon-144.png')} sizes='144x144'/>
        <link rel='apple-touch-icon' href={assetPathResolver('/app-icon-152.png')} sizes='152x152'/>
        <link rel='apple-touch-icon' href={assetPathResolver('/app-icon-180.png')} sizes='180x180'/>
        <link rel='apple-touch-icon' href={assetPathResolver('/app-icon-192.png')} sizes='192x192'/>

        <meta property='og:site_name' content={baseTitle}/>
        <meta property='og:title' content={pageTitle}/>
        <meta property='og:description' content={pageDescription}/>
        <meta property='og:locale' content={pageLocale}/>
        <meta property='og:url' content={pageUrl}/>
        <meta property='og:image' content={joinURL(BASE_URL, assetPathResolver('/og-image.png'))}/>
        <meta property='og:image:alt' content={pageDescription}/>

        <meta name='twitter:card' content='summary_large_image'/>
        <meta name='twitter:card' content='summary_large_image'/>
        <meta name='twitter:title' content={pageTitle}/>
        <meta name='twitter:description' content={pageDescription}/>
        <meta name='twitter:image' content={joinURL(BASE_URL, assetPathResolver('/twitter-card.png'))}/>

        <link rel='manifest' href={assetPathResolver('/manifest.json')}/>

        {injectScripts && <link rel='stylesheet' href={assetPathResolver('/common.css')}/>}
        {injectScripts && <link rel='stylesheet' href={assetPathResolver('/main.css')}/>}

        <script dangerouslySetInnerHTML={{ __html: `window.__LOCALS__=${JSON.stringify(locals)};` }}/>
        <script dangerouslySetInnerHTML={{ __html: `window.__VERSION__=${JSON.stringify(VERSION)};` }}/>

        {injectScripts && <script defer type='application/javascript' src={assetPathResolver('/polyfills.js')}></script>}
        <script defer type='application/javascript' src={assetPathResolver('/common.js')}></script>
        <script defer type='application/javascript' src={assetPathResolver('/main.js')}></script>
      </head>
      <body>
        <div id='root'>
          {injectScripts && rootComponent && createElement(rootComponent, {
            locals,
            routerProps,
            routerType: 'static',
          })}
        </div>
      </body>
    </html>
  )
}
