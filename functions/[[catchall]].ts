import template from '../build/index.html'
import * as module from '../build/main.edge'
import { renderRoot } from '../lib/esr/renderRoot'

export const onRequest: PagesFunction = async ({ request, functionPath: path }) => {
  const response = await renderRoot(module, template)(request, path)

  return response
}
