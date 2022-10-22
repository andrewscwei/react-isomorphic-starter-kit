import useDebug from '../../utils/useDebug'

const debug = useDebug(undefined, 'worker')

self.addEventListener('message', event => {
  const message = event.data.message
  debug('Receiving message from app...', 'OK', message)

  switch (message) {
    case 'Marco':
      self.postMessage({ message: 'Polo' })
    default:
      break
  }
})
