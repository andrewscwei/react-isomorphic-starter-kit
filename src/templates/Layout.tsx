/**
 * @file Base HTML template for all pages.
 */

import React from 'react'
import appConf from '../app.conf'

interface Props {
  body?: string
  bundleId?: string
  description?: string
  locals?: Record<string, any>
  title?: string
  url?: string
  resolveAssetPath?: (path: string) => string
}

export default function Layout({
  body,
  bundleId,
  description,
  locals,
  title,
  url,
  resolveAssetPath = t => t,
}: Props) {
  return (
    <html>
      {process.env.NODE_ENV !== 'development' && (
        <script dangerouslySetInnerHTML={{ __html: 'if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === "object") { __REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function() {}; }' }}/>
      )}
      <head>
        <meta charSet='utf-8'/>
        <meta httpEquiv='X-UA-Compatible' content='IE=edge'/>
        <meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover'/>
        <meta name='theme-color' content='#000'/>
        <link rel='canonical' href={appConf.meta.url}/>
        <link rel='mask-icon' href={resolveAssetPath('/favicon.svg')} sizes='any' color='#111111'/>
        <link rel='icon' href={resolveAssetPath('/favicon.svg')} sizes='192x192'/>

        <title>{title ?? appConf.meta.title}</title>
        <meta name='description' content={description ?? appConf.meta.description}/>

        <meta property='og:title' content={appConf.meta.title}/>
        <meta property='og:description' content={description ?? appConf.meta.description}/>
        <meta property='og:image' content={resolveAssetPath('/og-image-3600.png')}/>
        <meta property='og:url' content={url ?? appConf.meta.url}/>
        <meta property='og:type' content='website'/>
        <meta property='og:image:width' content='3600'/>
        <meta property='og:image:height' content='1890'/>

        <meta name='twitter:title' content={appConf.meta.title}/>
        <meta name='twitter:description' content={description ?? appConf.meta.description}/>
        <meta name='twitter:image' content={resolveAssetPath('/twitter-card-4096.png')}/>
        <meta name='twitter:card' content='summary_large_image'/>

        <meta name='mobile-web-app-capable' content='yes'/>
        <meta name='apple-mobile-web-app-capable' content='yes'/>
        <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent'/>
        <meta name='apple-mobile-web-app-title' content={appConf.meta.title}/>
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

        <link rel='stylesheet' href={resolveAssetPath('/common.css')}></link>
        <link rel='stylesheet' href={resolveAssetPath(`/${bundleId ?? 'main'}.css`)}></link>
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `window.__LOCALS__=${JSON.stringify(locals)};` }}/>
        <div id='app' dangerouslySetInnerHTML={{ __html: body ?? '' }}/>
        {process.env.NODE_ENV === 'production' && (
          <script type='application/javascript' src={resolveAssetPath('/polyfills.js')}></script>
        )}
        <script type='application/javascript' src={resolveAssetPath('/common.js')}></script>
        <script type='application/javascript' src={resolveAssetPath(`/${bundleId ?? 'main'}.js`)}></script>
      </body>
    </html>
  )
}
