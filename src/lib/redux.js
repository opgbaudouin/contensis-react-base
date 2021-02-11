export { reduxStore as store } from '%/redux/store';

// Remap the objects so they are presented in "feature" hierarchy
// e.g. { routing: { types, actions }, navigation: { types, actions } }
// instead of { types: { routing, navigation }, actions: { routing, navigation } }

import * as navigationTypes from '%/navigation/redux/types';
import * as routingTypes from '%/routing/redux/types';
import * as userTypes from '%/user/redux/types';
import * as versionTypes from '%/redux/version/types';

import * as navigationActions from '%/navigation/redux/actions';
import * as routingActions from '%/routing/redux/actions';
import * as userActions from '%/user/redux/actions';
import * as versionActions from '%/redux/version/actions';

import * as navigationSelectors from '%/navigation/redux/selectors';
import * as routingSelectors from '%/routing/redux/selectors';
import * as userSelectors from '%/user/redux/selectors';
import * as versionSelectors from '%/redux/version/selectors';

export const navigation = {
  types: navigationTypes,
  actions: navigationActions,
  selectors: navigationSelectors,
};
export const routing = {
  types: routingTypes,
  actions: routingActions,
  selectors: routingSelectors,
};
export const user = {
  types: userTypes,
  actions: userActions,
  selectors: userSelectors,
};
export const version = {
  types: versionTypes,
  actions: versionActions,
  selectors: versionSelectors,
};
