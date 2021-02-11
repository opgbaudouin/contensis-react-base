const defineConfig = require('./define-config').build;
const stringifyStrings = require('../src/contensis-react-base/util/stringify-strings');

module.exports = {
  base: stringifyStrings(defineConfig),
  dev: {
    __isBrowser__: 'true',
  },
  prod: {
    __isBrowser__: 'false',
  },
};
