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
    initialState: PropTypes.object.isRequired,
    initialLocale: PropTypes.object.isRequired,
    publicPath: PropTypes.string,
    manifest: PropTypes.object
  }

  render() {
    const { body, title, url, keywords, description, initialState, initialLocale, publicPath, manifest } = this.props;

    return (
      <html>
        <head>
          <meta charSet='utf-8'/>
          <meta httpEquiv='X-UA-Compatible' content='IE=edge'/>
          <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'/>
          <link rel='icon' href={`/favicon.png`}/>

          <title>{title || $APP_CONFIG.meta.title}</title>
          <meta name='description' content={description || $APP_CONFIG.meta.description}/>
          <meta name='keywords' content={keywords || $APP_CONFIG.meta.keywords}/>

          <meta property='og:url' content={url || $APP_CONFIG.meta.url}/>
          <meta property='og:image' content={resolve(`/og-image.png`, { publicPath, manifest })}/>
          <meta property='og:title' content={$APP_CONFIG.meta.title}/>
          <meta property='og:description' content={description || $APP_CONFIG.meta.description}/>

          <link rel='' href={resolve(`/manifest.json`, { publicPath, manifest })}/>
          <meta name='theme-color' content='#000000'/>
          <meta name='mobile-web-app-capable' content='yes'/>
          <meta name='application-name' content={$APP_CONFIG.meta.title}/>

          <meta name='apple-mobile-web-app-capable' content='yes'/>
          <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent'/>
          <meta name='apple-mobile-web-app-title' content={$APP_CONFIG.meta.title}/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-180x180-precomposed.png`, { publicPath, manifest })} sizes='180x180'/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-152x152-precomposed.png`, { publicPath, manifest })} sizes='152x152'/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-144x144-precomposed.png`, { publicPath, manifest })} sizes='144x144'/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-120x120-precomposed.png`, { publicPath, manifest })} sizes='120x120'/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-114x114-precomposed.png`, { publicPath, manifest })} sizes='114x114'/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-76x76-precomposed.png`, { publicPath, manifest })} sizes='76x76'/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-72x72-precomposed.png`, { publicPath, manifest })} sizes='72x72'/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-60x60-precomposed.png`, { publicPath, manifest })} sizes='60x60'/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-57x57-precomposed.png`, { publicPath, manifest })} sizes='57x57'/>
          <link rel='apple-touch-icon' href={resolve(`/apple-touch-icon-precomposed.png`, { publicPath, manifest })}/>

          <meta name='msapplication-TileImage' content={resolve(`/apple-touch-icon-144x144-precomposed.png`, { publicPath, manifest })}/>
          <meta name='msapplication-TileColor' content='#000000'/>
          <meta name='msapplication-config' content={resolve(`/browserconfig.xml`, { publicPath, manifest })}/>
          <meta name='msapplication-navbutton-color' content='#000000'/>

          <link rel='stylesheet' type='text/css' href='https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,700,700i'/>
          { process.env.NODE_ENV !== `development` &&
            <link rel='stylesheet' type='text/css' href={resolve(`/bundle.css`, { publicPath, manifest })}/>
          }
        </head>
        <body>
          <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__=${serialize(initialState)};` }}/>
          <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_LOCALE__=${serialize(initialLocale)};` }}/>
          <div id='app' dangerouslySetInnerHTML={{__html: body}}/>
          <script type='application/javascript' src={resolve(`/bundle.js`, { publicPath, manifest })}></script>
        </body>
      </html>
    );
  }
}

