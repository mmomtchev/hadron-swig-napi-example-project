import bindings from 'hadron-swig-napi-example-project';
import syncTests from './sync.js';

// This test is exclusive to Node.js
// npm run test:nodejs

describe('native', () => {
  syncTests(bindings);
});
