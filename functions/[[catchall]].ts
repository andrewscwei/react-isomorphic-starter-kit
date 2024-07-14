import template from '../build/client/index.html'
import * as module from '../build/server/main.edge'
import { renderRoot } from '../lib/esr/renderRoot'

export const onRequest: PagesFunction = async ({ request, functionPath: path }) => {
  const response = await renderRoot(module, template)(request, path)

  return response
}
