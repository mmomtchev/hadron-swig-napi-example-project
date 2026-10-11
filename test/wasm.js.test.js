// Explicit WASM import - this loads WASM even in Node.js
import WASM from 'hadron-swig-napi-example-project/wasm';
import { assert } from 'chai';

// This test can be run either in Node.js or in the browser
// npm run test:nodejs
// npm run test:browser

describe('WASM', () => {
  it('can be imported from JS', (done) => {
    WASM
      .then((bindings) => {
        const b = new bindings.Blob;
        assert.instanceOf(b, bindings.Blob);
        done();
      })
      .catch(done);
  });
});
