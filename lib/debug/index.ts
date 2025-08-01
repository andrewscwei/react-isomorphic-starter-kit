import createDebug from 'debug'

const SSR = typeof window === 'undefined'
const CLIENT_SYMBOL = '🤖'
const SERVER_SYMBOL = '⛅️'
const WORKER_SYMBOL = '🦾'
const TEST_SYMBOL = '👾'

export const debug = (() => {
  if (SSR) {
    if (typeof importScripts === 'undefined') {
      createDebug.enable(`${SERVER_SYMBOL}*`)

      return createDebug(SERVER_SYMBOL)
    }
    else {
      createDebug.enable(`${WORKER_SYMBOL}*`)

      return createDebug(WORKER_SYMBOL)
    }
  }
  else if (import.meta.env.TEST) {
    if (import.meta.env.DEBUG) {
      createDebug.enable(`${TEST_SYMBOL}*`)
    }

    return createDebug(TEST_SYMBOL)
  }
  else {
    createDebug.disable()

    if (import.meta.env.DEV || import.meta.env.DEBUG || import.meta.env.MODE === 'development') {
      createDebug.enable(`${CLIENT_SYMBOL}*`)
    }

    return createDebug(CLIENT_SYMBOL)
  }
})()
