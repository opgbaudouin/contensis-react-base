const defineConfig = require('./define-config');

const stringifyStrings = obj => {
  const returnObj = {};
  Object.entries(obj).forEach(([key, value]) => {
    switch (typeof value) {
      case 'string':
        returnObj[key] = JSON.stringify(value);
        break;
      case 'object':
        returnObj[key] = stringifyStrings(value);
        break;
      default:
        returnObj[key] = value;
        break;
    }
  });
  return returnObj;
};

module.exports = {
  base: stringifyStrings(defineConfig),
  dev: {
    __isBrowser__: 'true',
  },
  prod: {
    __isBrowser__: 'false',
  },
};
