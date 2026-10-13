// This is an automatic import that imports
// the native code in Node.js and the WASM in the browser
import bindings from 'hadron-swig-napi-example-project';
import asyncTests from './async.js';

// This test can be run either in Node.js or in the browser
// npm run test:nodejs
// npm run test:browser

const no_async = !!(
  (typeof process !== 'undefined' && process.env.NO_ASYNC) ||
  // @ts-ignore
  (typeof __karma__ !== 'undefined' && __karma__.config.args.includes('no-async'))
);

describe('auto WASM/native', () => {
  asyncTests(bindings, no_async);
});
