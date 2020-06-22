/**
 * @file Default web worker.
 */

const ctx = self;

// Post data to parent thread
ctx.postMessage({ message: 'Hello, world!' });

// Respond to message from parent thread
ctx.addEventListener('message', event => {
  console.log('Worker:', event.data.message);
});
