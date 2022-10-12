/**
 * @file Base HTML template for all pages.
 */

import React from 'react'

type Props = {
  body?: string
  locals?: Locals
  helmetContext?: Record<string, any>
  resolveAssetPath?: (path: string) => string
}

export default function Layout({
  body = '',
  locals = {},
  helmetContext = {},
  resolveAssetPath = t => t,
}: Props) {
  return (
    <html>
      {process.env.NODE_ENV !== 'development' && <script dangerouslySetInnerHTML={{ __html: 'if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === "object") { __REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function() {}; }' }}/>}
      <head>
        <meta charSet='utf-8'/>
        <meta httpEquiv='X-UA-Compatible' content='IE=edge'/>
        <meta name='viewport' content='width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover'/>

        {helmetContext.helmet?.title.toComponent()}
        {helmetContext.helmet?.priority.toComponent()}

        <meta name='theme-color' content='#000'/>

        {helmetContext.helmet?.meta.toComponent()}

        <meta name='twitter:card' content='summary_large_image'/>
        <meta name='mobile-web-app-capable' content='yes'/>
        <meta name='apple-mobile-web-app-capable' content='yes'/>
        <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent'/>

        {helmetContext.helmet?.link.toComponent()}

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
        <link rel='manifest' href={resolveAssetPath('/manifest.json')}/>

        <link rel='stylesheet' href={resolveAssetPath('/common.css')}/>
        <link rel='stylesheet' href={resolveAssetPath('/main.css')}/>

        {helmetContext.helmet?.script.toComponent()}

        {process.env.NODE_ENV !== 'development' && <script defer type='application/javascript' src={resolveAssetPath('/polyfills.js')}></script>}
        <script defer type='application/javascript' src={resolveAssetPath('/common.js')}></script>
        <script defer type='application/javascript' src={resolveAssetPath('/main.js')}></script>
      </head>
      <body>
        <div id='app' dangerouslySetInnerHTML={{ __html: body }}/>
      </body>
    </html>
  )
}
