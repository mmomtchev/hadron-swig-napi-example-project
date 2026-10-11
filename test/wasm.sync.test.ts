// Explicit WASM import - this loads WASM even in Node.js
import WASM from 'hadron-swig-napi-example-project/wasm';
import syncTests from './sync.js';

// This test can be run either in Node.js or in the browser
// npm run test:nodejs
// npm run test:browser

describe('WASM', () => {
  syncTests(WASM);
});
