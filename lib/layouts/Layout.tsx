/**
 * @file Base HTML layout for all pages.
 */

import { type PropsWithChildren } from 'react'
import { joinURL } from '../utils/joinURL'
import { type Metadata, type ResolveAssetPath } from './types'

type Props = PropsWithChildren<{
  /**
   * Custom scripts to be injected.
   */
  customScripts?: JSX.Element

  /**
   * Specifies whether CSS <link> tags should be injected.
   */
  injectStyles: boolean

  /**
   * Metadata for <meta> tags in <head>.
   */
  metadata: Metadata

  /**
   * Function for resolving asset paths.
   */
  resolveAssetPath?: ResolveAssetPath
}>

const { defaultLocale, publicURL } = import.meta.env.BUILD_ARGS

/**
 * Renders the JSX of the application root.
 *
 * @param params See {@link Props}.
 *
 * @returns JSX of the application root.
 */
export function Layout({
  children,
  customScripts,
  injectStyles,
  metadata,
  resolveAssetPath = t => t,
}: Readonly<Props>) {
  const baseTitle = metadata.baseTitle
  const pageDescription = metadata.description
  const pageLocale = metadata.locale ?? defaultLocale
  const pageTitle = metadata.title ?? baseTitle
  const pageURL = metadata.url
  const pageThemeColor = metadata.themeColor
  const pageMaskIconColor = metadata.maskIconColor ?? pageThemeColor

  return (
    <html lang={pageLocale}>
      <head>
        <meta charSet='utf-8'/>
        <meta content='IE=edge' httpEquiv='X-UA-Compatible'/>
        <meta content='width=device-width,initial-scale=1.0,maximum-scale=2.0,viewport-fit=cover' name='viewport'/>
        {pageDescription && <meta content={pageDescription} name='description'/>}
        {pageThemeColor && <meta content={pageThemeColor} name='theme-color'/>}

        <title>{pageTitle}</title>

        {pageURL && <link href={pageURL} rel='canonical'/>}
        <link color={pageMaskIconColor} href={resolveAssetPath('/mask-icon.svg')} rel='mask-icon' type='image/svg+xml'/>
        <link href={resolveAssetPath('/favicon.png')} rel='alternate icon' type='image/png'/>
        <link href={resolveAssetPath('/favicon.svg')} rel='icon' type='image/x-icon'/>
        <link href='data:;base64,iVBORw0KGgo=' rel='icon'/>

        <meta content='yes' name='mobile-web-app-capable'/>
        <meta content='yes' name='apple-mobile-web-app-capable'/>
        <meta content='black-translucent' name='apple-mobile-web-app-status-bar-style'/>
        {baseTitle && <meta content={baseTitle} name='apple-mobile-web-app-title'/>}
        <link href={resolveAssetPath('/app-icon-57.png')} rel='apple-touch-icon' sizes='57x57'/>
        <link href={resolveAssetPath('/app-icon-60.png')} rel='apple-touch-icon' sizes='60x60'/>
        <link href={resolveAssetPath('/app-icon-72.png')} rel='apple-touch-icon' sizes='72x72'/>
        <link href={resolveAssetPath('/app-icon-76.png')} rel='apple-touch-icon' sizes='76x76'/>
        <link href={resolveAssetPath('/app-icon-114.png')} rel='apple-touch-icon' sizes='114x114'/>
        <link href={resolveAssetPath('/app-icon-120.png')} rel='apple-touch-icon' sizes='120x120'/>
        <link href={resolveAssetPath('/app-icon-144.png')} rel='apple-touch-icon' sizes='144x144'/>
        <link href={resolveAssetPath('/app-icon-152.png')} rel='apple-touch-icon' sizes='152x152'/>
        <link href={resolveAssetPath('/app-icon-180.png')} rel='apple-touch-icon' sizes='180x180'/>
        <link href={resolveAssetPath('/app-icon-192.png')} rel='apple-touch-icon' sizes='192x192'/>

        {baseTitle && <meta content={baseTitle} property='og:site_name'/>}
        <meta content='website' property='og:type'/>
        {pageTitle && <meta content={pageTitle} property='og:title'/>}
        {pageDescription && <meta content={pageDescription} property='og:description'/>}
        <meta content={pageLocale} property='og:locale'/>
        {pageURL && <meta content={pageURL} property='og:url'/>}
        <meta content={joinURL(publicURL, '/og-image.png')} property='og:image'/>
        {pageDescription && <meta content={pageDescription} property='og:image:alt'/>}

        <meta content='summary_large_image' name='twitter:card'/>
        {pageTitle && <meta content={pageTitle} name='twitter:title'/>}
        {pageDescription && <meta content={pageDescription} name='twitter:description'/>}
        <meta content={joinURL(publicURL, '/twitter-card.png')} name='twitter:image'/>

        <link href={resolveAssetPath('/manifest.json')} rel='manifest'/>

        {injectStyles && <link href={resolveAssetPath('/styles.css')} rel='stylesheet'/>}

        <script defer src={resolveAssetPath('/main.js')} type='application/javascript'/>

        {customScripts}
      </head>
      <body>
        <div id='root'>
          {children}
        </div>
      </body>
    </html>
  )
}
