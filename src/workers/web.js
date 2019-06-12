/**
 * @file Default web worker.
 */

const debug = require('debug')('worker:web');
const ctx = self;

debug.enabled = process.env.NODE_ENV === 'development';

// Post data to parent thread
ctx.postMessage({ message: 'Hello, world!' });

// Respond to message from parent thread
ctx.addEventListener('message', event => {
  debug(event.data.message);
});
