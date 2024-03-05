import * as emnapi from '@emnapi/runtime';
import bindings from '../lib/binding/example.mjs';

const result = bindings()
    .then((m) => m.emnapiInit({ context: emnapi.getDefaultContext() }));

export default result;
