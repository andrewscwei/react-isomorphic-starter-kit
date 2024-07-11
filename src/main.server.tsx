/**
 * @file Server entry file.
 */

import { type RenderFunc } from '@lib/server'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouterProvider, createStaticRouter } from 'react-router-dom/server'
import { App } from './ui/App'

export const render: RenderFunc = ({ context, routes }, options = {}) => {
  return renderToPipeableStream(
    (
      <App>
        <StaticRouterProvider context={context} router={createStaticRouter(routes, context)}/>
      </App>
    ), options,
  )
}
