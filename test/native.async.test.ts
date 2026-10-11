import bindings from 'hadron-swig-napi-example-project';
import asyncTests from './async.js';

// This test is exclusive to Node.js
// npx run test:nodejs

const no_async = !!process.env.NO_ASYNC;

describe('native', () => {
  asyncTests(bindings, no_async);
});
