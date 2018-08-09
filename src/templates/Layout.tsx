/* tslint:disable max-line-length */
/**
 * @file Base HTML template for all containers.
 */

import appConfig from '@/../config/app.conf';
import path from 'path';
import React, { PureComponent, ReactElement } from 'react';
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

export default class Layout extends PureComponent<Props> {
  /**
   * Resolves a raw asset path with the fingerprinted equivalent. This only works
   * if a manifest object is provided globally.
   *
   * @param pathToResolve The asset path to this.resolveAssetPath.
   *
   * @return The resolved path.
   */
  resolveAssetPath(pathToResolve: string, manifest: AssetManifest = __ASSET_MANIFEST__): string {
    const normalizedPath: string = path.join.apply(null, pathToResolve.split(`/`));
    const publicPath = process.env.NODE_ENV === `production` ? appConfig.build.publicPath : `/`;

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

  render() {
    const { body, title, url, keywords, description, initialState, initialStyles } = this.props;

    return (
      <html>
        <head>
          <meta charSet='utf-8'/>
          <meta httpEquiv='X-UA-Compatible' content='IE=edge'/>
          <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'/>
          <link rel='icon' href={this.resolveAssetPath(`/favicon.png`)}/>

          <title>{title || appConfig.meta.title}</title>
          <meta name='description' content={description || appConfig.meta.description}/>
          <meta name='keywords' content={keywords || appConfig.meta.keywords}/>

          <meta property='og:url' content={url || appConfig.meta.url}/>
          <meta property='og:image' content={this.resolveAssetPath(`/og-image.png`)}/>
          <meta property='og:title' content={appConfig.meta.title}/>
          <meta property='og:description' content={description || appConfig.meta.description}/>

          <link rel='' href={this.resolveAssetPath(`/manifest.json`)}/>
          <meta name='theme-color' content='#000000'/>
          <meta name='mobile-web-app-capable' content='yes'/>
          <meta name='application-name' content={appConfig.meta.title}/>

          <meta name='apple-mobile-web-app-capable' content='yes'/>
          <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent'/>
          <meta name='apple-mobile-web-app-title' content={appConfig.meta.title}/>
          <link rel='apple-touch-icon' href={this.resolveAssetPath(`/apple-touch-icon-180x180-precomposed.png`)} sizes='180x180'/>
          <link rel='apple-touch-icon' href={this.resolveAssetPath(`/apple-touch-icon-152x152-precomposed.png`)} sizes='152x152'/>
          <link rel='apple-touch-icon' href={this.resolveAssetPath(`/apple-touch-icon-144x144-precomposed.png`)} sizes='144x144'/>
          <link rel='apple-touch-icon' href={this.resolveAssetPath(`/apple-touch-icon-120x120-precomposed.png`)} sizes='120x120'/>
          <link rel='apple-touch-icon' href={this.resolveAssetPath(`/apple-touch-icon-114x114-precomposed.png`)} sizes='114x114'/>
          <link rel='apple-touch-icon' href={this.resolveAssetPath(`/apple-touch-icon-76x76-precomposed.png`)} sizes='76x76'/>
          <link rel='apple-touch-icon' href={this.resolveAssetPath(`/apple-touch-icon-72x72-precomposed.png`)} sizes='72x72'/>
          <link rel='apple-touch-icon' href={this.resolveAssetPath(`/apple-touch-icon-60x60-precomposed.png`)} sizes='60x60'/>
          <link rel='apple-touch-icon' href={this.resolveAssetPath(`/apple-touch-icon-57x57-precomposed.png`)} sizes='57x57'/>
          <link rel='apple-touch-icon' href={this.resolveAssetPath(`/apple-touch-icon-precomposed.png`)}/>

          <meta name='msapplication-TileImage' content={this.resolveAssetPath(`/apple-touch-icon-144x144-precomposed.png`)}/>
          <meta name='msapplication-TileColor' content='#000000'/>
          <meta name='msapplication-config' content={this.resolveAssetPath(`/browserconfig.xml`)}/>
          <meta name='msapplication-navbutton-color' content='#000000'/>

          <link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,700,700i'/>

          { initialStyles }
        </head>
        <body>
          { initialState &&
            <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__=${serialize(initialState)};` }}/>
          }
          <div id='app' dangerouslySetInnerHTML={{ __html: body || `` }}/>
          <script type='application/javascript' src={this.resolveAssetPath(`/bundle.js`)}></script>
        </body>
      </html>
    );
  }
}
