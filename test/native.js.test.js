import native from 'hadron-swig-napi-example-project';
import { assert } from 'chai';

// This test is exclusive to Node.js
// npm run test:nodejs

describe('native', () => {
  it('can be imported from JS', () => {
        const b = new native.Blob;
        assert.instanceOf(b, native.Blob);
  });
});
