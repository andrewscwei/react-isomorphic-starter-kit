self.addEventListener('message', event => {
  const message = event.data.message

  if (message === 'Marco') {
    self.postMessage({ message: 'Polo' })
  }
})
