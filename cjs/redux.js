'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('immutable');
var reducers = require('./reducers-0387eb16.js');
var selectors$1 = require('./selectors-975b9ec9.js');
require('redux');
require('redux-immutable');
require('redux-thunk');
require('redux-saga');
var selectors = require('./selectors-44ae4a9e.js');
require('query-string');
var selectors$3 = require('./selectors-00e8bddc.js');
var selectors$2 = require('./selectors-f89efb18.js');
var actions = require('./actions-ddd061c7.js');

const loadNavigationTree = () => selectors$1.action(selectors.GET_NODE_TREE);

var navigationActions = /*#__PURE__*/Object.freeze({
  __proto__: null,
  loadNavigationTree: loadNavigationTree
});

const navigation = {
  types: selectors.navigationTypes,
  actions: navigationActions,
  selectors: selectors.navigationSelectors
};
const routing = {
  types: selectors$1.routingTypes,
  actions: selectors$1.routingActions,
  selectors: selectors$1.routingSelectors
};
const user = {
  types: reducers.userTypes,
  actions: actions.userActions,
  selectors: selectors$2.userSelectors
};
const version = {
  types: selectors.versionTypes,
  actions: selectors.versionActions,
  selectors: selectors$3.versionSelectors
};

Object.defineProperty(exports, 'store', {
  enumerable: true,
  get: function () {
    return selectors.reduxStore;
  }
});
exports.navigation = navigation;
exports.routing = routing;
exports.user = user;
exports.version = version;
//# sourceMappingURL=redux.js.map
