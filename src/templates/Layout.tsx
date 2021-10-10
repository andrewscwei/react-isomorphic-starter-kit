/**
 * @file Base HTML template for all containers.
 */

import path from 'path'
import React, { Fragment, FunctionComponent, ReactElement } from 'react'
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
  locals?: Record<string, any>
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

const Layout: FunctionComponent<Props> = ({
  body,
  bundleId,
  description,
  initialState,
  initialStyles,
  keywords,
  locals,
  title,
  url,
}: Props) => (
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
      <meta property='og:site_name' content={__BUILD_CONFIG__.meta.title}/>
      <meta property='og:description' content={description || __BUILD_CONFIG__.meta.description}/>
      <meta property='og:image' content={resolveAssetPath('/icon-1680.png')}/>
      <meta property='og:url' content={url || __BUILD_CONFIG__.meta.url}/>
      <meta property='og:type' content='website'/>
      <meta property='og:image:width' content='1680' />
      <meta property='og:image:height' content='1680' />

      <meta name='twitter:title' content={__BUILD_CONFIG__.meta.title}/>
      <meta name='twitter:description' content={description || __BUILD_CONFIG__.meta.description}/>
      <meta name='twitter:image' content={resolveAssetPath('/icon-1680.png')}/>
      <meta name='twitter:card' content='summary'/>

      <meta name='mobile-web-app-capable' content='yes'/>
      <meta name='apple-mobile-web-app-capable' content='yes'/>
      <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent'/>
      <meta name='apple-mobile-web-app-title' content={__BUILD_CONFIG__.meta.title}/>
      <link rel='apple-touch-icon' href={resolveAssetPath('/icon-1024.png')} sizes='192x192'/>

      <link rel='manifest' href={resolveAssetPath('/manifest.json')}/>

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
          <Fragment>
            <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${__BUILD_CONFIG__.gtag}`} height='0' width='0' style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
          </Fragment>
      }
    </body>
  </html>
)

export default Layout
