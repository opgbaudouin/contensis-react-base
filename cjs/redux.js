'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('redux');
require('redux-thunk');
require('redux-saga');
require('redux-injectors');
require('immer');
var version$1 = require('./version-01903e3e.js');
var actions$1 = require('./actions-f42b09db.js');
require('./reducers-fde41d6b.js');
require('@redux-saga/core/effects');
var selectors$1 = require('./selectors-3ea43584.js');
var version$2 = require('./version-63682006.js');
require('immutable');
require('query-string');

var types = {
  navigation: version$1.navigation,
  routing: actions$1.routing,
  version: version$1.version
};

const loadNavigationTree = () => selectors$1.action(version$1.GET_NODE_TREE);

var navigation = /*#__PURE__*/Object.freeze({
  __proto__: null,
  loadNavigationTree: loadNavigationTree
});

var actions = {
  navigation,
  routing: actions$1.routing$1,
  version: version$1.version$1
};

var selectors = {
  navigation: version$1.navigation$1,
  routing: selectors$1.routing,
  version: version$2.version
};

// e.g. { routing: { types, actions }, navigation: { types, actions } }
// instead of { types: { routing, navigation }, actions: { routing, navigation } }

const navigation$1 = {
  types: types.navigation,
  actions: actions.navigation,
  selectors: selectors.navigation
};
const routing = {
  types: types.routing,
  actions: actions.routing,
  selectors: selectors.routing
};
const version = {
  types: types.version,
  actions: actions.version,
  selectors: selectors.version
};

exports.convertSagaArray = version$1.convertSagaArray;
exports.injectReducer = version$1.injectReducer;
exports.injectRedux = version$1.injectRedux;
exports.injectSaga = version$1.injectSaga;
Object.defineProperty(exports, 'store', {
  enumerable: true,
  get: function () {
    return version$1.reduxStore;
  }
});
exports.useInjectRedux = version$1.useInjectRedux;
exports.navigation = navigation$1;
exports.routing = routing;
exports.version = version;
//# sourceMappingURL=redux.js.map
