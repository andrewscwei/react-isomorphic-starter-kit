import debug from 'debug';

export default process.env.NODE_ENV === 'development' ? debug('app') : () => {};
