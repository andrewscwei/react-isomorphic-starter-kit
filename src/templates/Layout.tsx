/**
 * @file Base HTML template for all containers.
 */

import path from 'path'
import React, { Fragment, ReactElement } from 'react'
import serialize from 'serialize-javascript'
import { css } from 'styled-components'
import { AppState } from '../store'

interface Props {
  body?: string
  bundleId?: string
  description?: string
  initialState?: Omit<AppState, 'i18n'>
  initialStyles?: Array<ReactElement<unknown>>
  keywords?: string
  title?: string
  url?: string
}

/**
 * Resolves a raw asset path with the fingerprinted equivalent. This only works
 * if a manifest object is provided globally.
 *
 * @param pathToResolve The asset path to resolveAssetPath.
 *
 * @return The resolved path.
 */
function resolveAssetPath(pathToResolve: string, manifest: AssetManifest = __ASSET_MANIFEST__): string {
  const normalizedPath: string = path.join.apply(null, pathToResolve.split('/'))
  const publicPath = __BUILD_CONFIG__.build.publicPath

  let out = normalizedPath

  if (manifest && manifest.hasOwnProperty(normalizedPath)) {
    out = manifest[normalizedPath]
  }
  else if (manifest && manifest.hasOwnProperty(`${publicPath}${normalizedPath}`)) {
    out = manifest[`${publicPath}${normalizedPath}`]
  }

  if (!out.startsWith(publicPath)) out = `${publicPath}${out}`

  return out
}

function Layout({
  body,
  bundleId,
  description,
  initialState,
  initialStyles,
  keywords,
  title,
  url,
}: Props): ReactElement {
  return (
    <html>
      { process.env.NODE_ENV !== 'development' &&
        <script dangerouslySetInnerHTML={{ __html: 'if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === "object") { __REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function() {}; }' }}/>
      }
      <head>
        <meta charSet='utf-8'/>
        <meta httpEquiv='X-UA-Compatible' content='IE=edge'/>
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'/>
        <link rel='icon' href={resolveAssetPath('/favicon.png')}/>

        <title>{title || __BUILD_CONFIG__.meta.title}</title>
        <meta name='description' content={description || __BUILD_CONFIG__.meta.description}/>
        <meta name='keywords' content={keywords || __BUILD_CONFIG__.meta.keywords}/>

        <meta property='og:url' content={url || __BUILD_CONFIG__.meta.url}/>
        <meta property='og:image' content={resolveAssetPath('/og-image.png')}/>
        <meta property='og:title' content={__BUILD_CONFIG__.meta.title}/>
        <meta property='og:description' content={description || __BUILD_CONFIG__.meta.description}/>

        <link rel='' href={resolveAssetPath('/manifest.json')}/>
        <meta name='theme-color' content='#000000'/>
        <meta name='mobile-web-app-capable' content='yes'/>
        <meta name='application-name' content={__BUILD_CONFIG__.meta.title}/>

        <meta name='apple-mobile-web-app-capable' content='yes'/>
        <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent'/>
        <meta name='apple-mobile-web-app-title' content={__BUILD_CONFIG__.meta.title}/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/apple-touch-icon-180x180-precomposed.png')} sizes='180x180'/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/apple-touch-icon-152x152-precomposed.png')} sizes='152x152'/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/apple-touch-icon-144x144-precomposed.png')} sizes='144x144'/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/apple-touch-icon-120x120-precomposed.png')} sizes='120x120'/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/apple-touch-icon-114x114-precomposed.png')} sizes='114x114'/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/apple-touch-icon-76x76-precomposed.png')} sizes='76x76'/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/apple-touch-icon-72x72-precomposed.png')} sizes='72x72'/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/apple-touch-icon-60x60-precomposed.png')} sizes='60x60'/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/apple-touch-icon-57x57-precomposed.png')} sizes='57x57'/>
        <link rel='apple-touch-icon' href={resolveAssetPath('/apple-touch-icon-precomposed.png')}/>

        <meta name='msapplication-TileImage' content={resolveAssetPath('/apple-touch-icon-144x144-precomposed.png')}/>
        <meta name='msapplication-TileColor' content='#000000'/>
        <meta name='msapplication-config' content={resolveAssetPath('/browserconfig.xml')}/>
        <meta name='msapplication-navbutton-color' content='#000000'/>

        <style dangerouslySetInnerHTML={{
          __html: css`
            @font-face {
              font-family: 'Roboto';
              src: url('${resolveAssetPath('/fonts/Roboto-Bold.ttf')}') format('truetype');
              font-style: normal;
              font-weight: 700;
            }

            @font-face {
              font-family: 'Roboto';
              src: url('${resolveAssetPath('/fonts/Roboto-Regular.ttf')}') format('truetype');
              font-style: normal;
              font-weight: 400;
            }

            @font-face {
              font-family: 'Roboto';
              src: url('${resolveAssetPath('/fonts/Roboto-Light.ttf')}') format('truetype');
              font-style: normal;
              font-weight: 300;
            }
          `.toString(),
        }}/>

        { process.env.NODE_ENV === 'production' && __BUILD_CONFIG__.gtag &&
          <Fragment>
            <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','${__BUILD_CONFIG__.gtag}');` }}/>
          </Fragment>
        }

        { process.env.NODE_ENV === 'production' && __BUILD_CONFIG__.ga &&
          <Fragment>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${__BUILD_CONFIG__.ga}`}/>
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${__BUILD_CONFIG__.ga}');` }}/>
          </Fragment>
        }

        { initialStyles }
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `window.__VERSION__='${__BUILD_CONFIG__.version}';` }}/>
        <script dangerouslySetInnerHTML={{ __html: `window.__BUILD_NUMBER__='${__BUILD_CONFIG__.buildNumber}';` }}/>
        { initialState &&
          <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__=${serialize(initialState)};` }}/>
        }
        <div id='app' dangerouslySetInnerHTML={{ __html: body || '' }}/>
        <script type='application/javascript' src={resolveAssetPath('/polyfills.js')}></script>
        <script type='application/javascript' src={resolveAssetPath('/common.js')}></script>
        <script type='application/javascript' src={resolveAssetPath(`/${bundleId ?? 'main'}.js`)}></script>

        { process.env.NODE_ENV === 'production' && __BUILD_CONFIG__.gtag &&
          <Fragment>
            <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${__BUILD_CONFIG__.gtag}`} height='0' width='0' style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
          </Fragment>
        }
      </body>
    </html>
  )
}

export default Layout
