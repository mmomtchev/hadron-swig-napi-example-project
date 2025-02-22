module.exports = {
  'spec': process.env.NO_ASYNC ? 'test/*.sync.test.*s' : 'test/*.test.*s',
  'repeats': 1000,
  'node-option': [
    'import=tsx/esm'
  ]
};
