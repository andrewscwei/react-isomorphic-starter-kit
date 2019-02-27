/* tslint:disable max-line-length */
/**
 * @file Base HTML template for all containers.
 */

import path from 'path';
import React, { ReactElement, SFC } from 'react';
import serialize from 'serialize-javascript';

interface Props {
  body?: string;
  title?: string;
  url?: string;
  keywords?: string;
  description?: string;
  initialState?: object;
  initialStyles?: Array<ReactElement<{}>>;
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
  const normalizedPath: string = path.join.apply(null, pathToResolve.split('/'));
  const publicPath = __BUILD_CONFIG__.build.publicPath;

  let out = normalizedPath;

  if (manifest && manifest.hasOwnProperty(normalizedPath)) {
    out = manifest[normalizedPath];
  }
  else if (manifest && manifest.hasOwnProperty(`${publicPath}${normalizedPath}`)) {
    out = manifest[`${publicPath}${normalizedPath}`];
  }

  if (!out.startsWith(publicPath)) out = `${publicPath}${out}`;

  return out;
}

const Layout: SFC<Props> = ({ body, title, url, keywords, description, initialState, initialStyles }) => (
  <html>
    { process.env.NODE_ENV !== 'development' &&
      <script dangerouslySetInnerHTML={{ __html: "if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object') { __REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function() {}; }" }}/>
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

      <link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,700,700i'/>

      { process.env.NODE_ENV === 'production' && __BUILD_CONFIG__.ga &&
        <script dangerouslySetInnerHTML={{ __html: `(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create','${__BUILD_CONFIG__.ga}','auto');ga('send','pageview');` }}/>
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
      <script type='application/javascript' src={resolveAssetPath('/bundle.js')}></script>
    </body>
  </html>
);

export default Layout;
