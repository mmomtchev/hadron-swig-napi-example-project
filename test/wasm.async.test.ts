// Explicit WASM import - this loads WASM even in Node.js
import WASM from 'hadron-swig-napi-example-project/wasm';
import asyncTests from './async.js';

// This test can be run either in Node.js or in the browser
// npm run test:nodejs
// npm run test:browser

const no_async = !!(
  (typeof process !== 'undefined' && process.env.NO_ASYNC) ||
  // @ts-ignore
  (typeof __karma__ !== 'undefined' && __karma__.config.args.includes('no-async'))
);

describe('WASM', () => {
  asyncTests(WASM, no_async);
});
