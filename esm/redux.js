import 'immutable';
import { u as userTypes } from './reducers-9336f64f.js';
import { y as action, z as routingTypes, A as routingActions, B as routingSelectors } from './selectors-10d55d92.js';
import 'redux';
import 'redux-immutable';
import 'redux-thunk';
import 'redux-saga';
import { G as GET_NODE_TREE, n as navigationTypes, d as navigationSelectors, v as versionTypes, e as versionActions } from './selectors-7c490e47.js';
export { r as store } from './selectors-7c490e47.js';
import 'query-string';
import { v as versionSelectors } from './selectors-0213acd7.js';
import { u as userSelectors } from './selectors-a83a49a5.js';
import { u as userActions } from './actions-18767d1f.js';

const loadNavigationTree = () => action(GET_NODE_TREE);

var navigationActions = /*#__PURE__*/Object.freeze({
  __proto__: null,
  loadNavigationTree: loadNavigationTree
});

const navigation = {
  types: navigationTypes,
  actions: navigationActions,
  selectors: navigationSelectors
};
const routing = {
  types: routingTypes,
  actions: routingActions,
  selectors: routingSelectors
};
const user = {
  types: userTypes,
  actions: userActions,
  selectors: userSelectors
};
const version = {
  types: versionTypes,
  actions: versionActions,
  selectors: versionSelectors
};

export { navigation, routing, user, version };
//# sourceMappingURL=redux.js.map
