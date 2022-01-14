/**
 * @file Base HTML template for all containers.
 */

import path from 'path'
import React, { ReactElement } from 'react'
import serialize from 'serialize-javascript'
import { AppState } from '../store'

interface Props {
  body?: string
  bundleId?: string
  description?: string
  initialState?: Omit<AppState, 'i18n'>
  initialStyles?: ReactElement<unknown>[]
  keywords?: string
  locals?: Record<string, any>
  title?: string
  url?: string
}

/**
 * Resolves a raw asset path with the fingerprinted equivalent. This only works if a manifest object
 * is provided globally.
 *
 * @param pathToResolve The asset path to resolveAssetPath.
 *
 * @return The resolved path.
 */
function resolveAssetPath(pathToResolve: string, manifest: AssetManifest = __ASSET_MANIFEST__): string {
  const normalizedPath: string = path.join.apply(null, pathToResolve.split('/'))
  const publicPath = __BUILD_CONFIG__.build.publicPath

  let out = normalizedPath

  if (manifest) {
    if (manifest.hasOwnProperty(normalizedPath)) {
      out = manifest[normalizedPath]
    }
    else if (manifest.hasOwnProperty(`${publicPath}${normalizedPath}`)) {
      out = manifest[`${publicPath}${normalizedPath}`]
    }
  }

  if (!out.startsWith(publicPath)) out = `${publicPath}${out}`

  return out
}

export default function Layout({
  body,
  bundleId,
  description,
  initialState,
  initialStyles,
  keywords,
  locals,
  title,
  url,
}: Props) {
  return (
    <html>
      { process.env.NODE_ENV !== 'development' &&
          <script dangerouslySetInnerHTML={{ __html: 'if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === "object") { __REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function() {}; }' }}/>
      }
      <head>
        <meta charSet='utf-8'/>
        <meta httpEquiv='X-UA-Compatible' content='IE=edge'/>
        <meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover'/>
        <meta name='theme-color' content='#000000'/>
        <link rel='canonical' href={__BUILD_CONFIG__.meta.url}/>
        <link rel='mask-icon' href={resolveAssetPath('/favicon.svg')} sizes='any' color='#111111'/>
        <link rel='icon' href={resolveAssetPath('/favicon.svg')} sizes='192x192'/>

        <title>{title || __BUILD_CONFIG__.meta.title}</title>
        <meta name='description' content={description || __BUILD_CONFIG__.meta.description}/>

        <meta property='og:title' content={__BUILD_CONFIG__.meta.title}/>
        <meta property='og:description' content={description || __BUILD_CONFIG__.meta.description}/>
        <meta property='og:image' content={`${__BUILD_CONFIG__.meta.title}/${resolveAssetPath('/og-image-3600.png')}`}/>
        <meta property='og:url' content={url || __BUILD_CONFIG__.meta.url}/>
        <meta property='og:type' content='website'/>
        <meta property='og:image:width' content='3600'/>
        <meta property='og:image:height' content='1890'/>

        <meta name='twitter:title' content={__BUILD_CONFIG__.meta.title}/>
        <meta name='twitter:description' content={description || __BUILD_CONFIG__.meta.description}/>
        <meta name='twitter:image' content={`${__BUILD_CONFIG__.meta.title}/${resolveAssetPath('/twitter-card-4096.png')}`}/>
        <meta name='twitter:card' content='summary_large_image'/>

        <meta name='mobile-web-app-capable' content='yes'/>
        <meta name='apple-mobile-web-app-capable' content='yes'/>
        <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent'/>
        <meta name='apple-mobile-web-app-title' content={__BUILD_CONFIG__.meta.title}/>
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
        <link rel='icon' href={resolveAssetPath('/app-icon-16.png')} type='image/png' sizes='16x16'/>
        <link rel='icon' href={resolveAssetPath('/app-icon-32.png')} type='image/png' sizes='32x32'/>
        <link rel='icon' href={resolveAssetPath('/app-icon-96.png')} type='image/png' sizes='96x96'/>
        <link rel='icon' href={resolveAssetPath('/app-icon-192.png')} type='image/png' sizes='192x192'/>

        <link rel='manifest' href={resolveAssetPath('/manifest.json')}/>

        { process.env.NODE_ENV === 'production' && __BUILD_CONFIG__.gtag &&
            <>
              <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','${__BUILD_CONFIG__.gtag}');` }}/>
            </>
        }

        { process.env.NODE_ENV === 'production' && __BUILD_CONFIG__.ga &&
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${__BUILD_CONFIG__.ga}`}/>
              <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${__BUILD_CONFIG__.ga}');` }}/>
            </>
        }

        { initialStyles }
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `window.__VERSION__='${__BUILD_CONFIG__.version}';` }}/>
        <script dangerouslySetInnerHTML={{ __html: `window.__BUILD_NUMBER__='${__BUILD_CONFIG__.buildNumber}';` }}/>
        <script dangerouslySetInnerHTML={{ __html: `window.__LOCALS__ = ${serialize(locals)}` }}/>
        { initialState &&
            <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__ = ${serialize(initialState)};` }}/>
        }
        <div id='app' dangerouslySetInnerHTML={{ __html: body || '' }}/>
        { process.env.NODE_ENV === 'production' &&
          <script type='application/javascript' src={resolveAssetPath('/polyfills.js')}></script>
        }
        <script type='application/javascript' src={resolveAssetPath('/common.js')}></script>
        <script type='application/javascript' src={resolveAssetPath(`/${bundleId ?? 'main'}.js`)}></script>

        { process.env.NODE_ENV === 'production' && __BUILD_CONFIG__.gtag &&
            <>
              <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${__BUILD_CONFIG__.gtag}`} height='0' width='0' style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
            </>
        }
      </body>
    </html>
  )
}
