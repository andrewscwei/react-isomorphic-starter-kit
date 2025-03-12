import template from '@build/index.html'
import * as module from '@build/main.edge.js'
import { catchAll } from '@lib/esr'

export const onRequest: PagesFunction = async ({ request }) => catchAll({ module, template })(request)
