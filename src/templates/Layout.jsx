/**
 * @file Base HTML template for all containers.
 */

import resolve from '@/utils/resolveAssetPath';
import serialize from 'serialize-javascript';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

export default class Layout extends PureComponent {
  static propTypes = {
    body: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
    keywords: PropTypes.string,
    description: PropTypes.string,
    config: PropTypes.object.isRequired,
    initialState: PropTypes.object.isRequired,
    initialLocale: PropTypes.object.isRequired,
    manifest: PropTypes.object
  }

  render() {
    const { body, title, url, keywords, description, config, initialState, initialLocale, manifest } = this.props;

    return (
      <html>
        <head>
          <meta charSet='utf-8'/>
          <meta httpEquiv='X-UA-Compatible' content='IE=edge'/>
          <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'/>
          <link rel='icon' href={`/favicon.png`}/>

          <title>{title || config.appName}</title>
          <meta name='description' content={description || config.description}/>
          <meta name='keywords' content={keywords || config.keywords}/>

          <meta property='og:url' content={url || config.url}/>
          <meta property='og:image' content={resolve(`/og-image.png`, manifest)}/>
          <meta property='og:title' content={config.appName}/>
          <meta property='og:description' content={description || config.description}/>

          <link rel='' href={resolve(`/manifest.json`, manifest)}/>
          <meta name='theme-color' content='#3f51b5'/>
          <meta name='mobile-web-app-capable' content='yes'/>
          <meta name='application-name' content={config.appName}/>

          <meta name='apple-mobile-web-app-capable' content='yes'/>
          <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent'/>
          <meta name='apple-mobile-web-app-title' content={config.appName}/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-180x180-precomposed.png`, manifest)} sizes='180x180'/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-152x152-precomposed.png`, manifest)} sizes='152x152'/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-144x144-precomposed.png`, manifest)} sizes='144x144'/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-120x120-precomposed.png`, manifest)} sizes='120x120'/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-114x114-precomposed.png`, manifest)} sizes='114x114'/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-76x76-precomposed.png`, manifest)} sizes='76x76'/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-72x72-precomposed.png`, manifest)} sizes='72x72'/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-60x60-precomposed.png`, manifest)} sizes='60x60'/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-57x57-precomposed.png`, manifest)} sizes='57x57'/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-precomposed.png`, manifest)}/>

          <meta name='msapplication-TileImage' content={resolve(`/apple-touch-icon-144x144-precomposed.png`, manifest)}/>
          <meta name='msapplication-TileColor' content='#3f51b5'/>
          <meta name='msapplication-config' content={resolve(`/browserconfig.xml`, manifest)}/>
          <meta name='msapplication-navbutton-color' content='#ff3300'/>

          { process.env.NODE_ENV !== `development` &&
            <link rel='stylesheet' type='text/css' href={resolve(`/bundle.css`, manifest)}/>
          }
        </head>
        <body>
          <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__=${serialize(initialState)};` }}/>
          <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_LOCALE__=${serialize(initialLocale)};` }}/>
          <div id='app' dangerouslySetInnerHTML={{__html: body}}/>
          <script type='application/javascript' src={resolve(`/manifest.js`, manifest)}></script>
          <script type='application/javascript' src={resolve(`/common.js`, manifest)}></script>
          <script type='application/javascript' src={resolve(`/bundle.js`, manifest)}></script>
        </body>
      </html>
    );
  }
}

