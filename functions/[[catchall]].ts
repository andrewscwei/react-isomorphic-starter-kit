import template from '@build/index.html'
import * as module from '@build/main.edge.js'
import { catchAllMiddleware } from '@lib/esr'

export const onRequest: PagesFunction = catchAllMiddleware({ module, template })
