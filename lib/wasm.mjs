import * as emnapi from '@emnapi/runtime';
import bindings from './binding/emscripten-wasm32/example.mjs';

const result = bindings()
    .then((m) => m.emnapiInit({ context: emnapi.getDefaultContext() }));

export default result;
