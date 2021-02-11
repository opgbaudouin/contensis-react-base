'use strict';

var immutable = require('immutable');

const selectUserIsLoading = state => {
  return state.getIn(['user', 'authenticationState', 'loading']);
};
const selectUserIsAuthenticated = state => {
  return state.getIn(['user', 'authenticationState', 'authenticated']) && state.getIn(['user']) != null;
};
const selectUserAuthenticationError = state => {
  return state.getIn(['user', 'authenticationState', 'authenticationError']);
};
const selectUserError = state => {
  return state.getIn(['user', 'authenticationState', 'error']);
};
const selectClientCredentials = state => {
  return state.getIn(['user', 'authenticationState', 'clientCredentials']);
};
const selectUser = state => {
  return state.getIn(['user']);
};
const selectUserIsZengentiStaff = state => {
  return state.getIn(['user', 'isZengentiStaff']);
};
const selectUserGuid = state => {
  return state.getIn(['user', 'id']);
};
const selectUsername = state => {
  return state.getIn(['user', 'userName']);
};
const selectUserEmail = state => {
  return state.getIn(['user', 'email']);
};
const selectUserGroups = state => {
  return state.getIn(['user', 'groups']);
};
const selectUserSecurityToken = state => {
  return state.getIn(['user', 'authenticationState', 'clientCredentials', 'contensisClassicToken']);
};
const selectUserRegistration = state => state.getIn(['user', 'registration'], immutable.Map());
const selectUserRegistrationError = state => state.getIn(['user', 'registration', 'error'], false);
const selectUserRegistrationIsLoading = state => state.getIn(['user', 'registration', 'loading'], false);
const selectUserRegistrationIsSuccess = state => state.getIn(['user', 'registration', 'success'], false);

var userSelectors = /*#__PURE__*/Object.freeze({
  __proto__: null,
  selectUserIsLoading: selectUserIsLoading,
  selectUserIsAuthenticated: selectUserIsAuthenticated,
  selectUserAuthenticationError: selectUserAuthenticationError,
  selectUserError: selectUserError,
  selectClientCredentials: selectClientCredentials,
  selectUser: selectUser,
  selectUserIsZengentiStaff: selectUserIsZengentiStaff,
  selectUserGuid: selectUserGuid,
  selectUsername: selectUsername,
  selectUserEmail: selectUserEmail,
  selectUserGroups: selectUserGroups,
  selectUserSecurityToken: selectUserSecurityToken,
  selectUserRegistration: selectUserRegistration,
  selectUserRegistrationError: selectUserRegistrationError,
  selectUserRegistrationIsLoading: selectUserRegistrationIsLoading,
  selectUserRegistrationIsSuccess: selectUserRegistrationIsSuccess
});

exports.selectClientCredentials = selectClientCredentials;
exports.selectUser = selectUser;
exports.selectUserAuthenticationError = selectUserAuthenticationError;
exports.selectUserError = selectUserError;
exports.selectUserGroups = selectUserGroups;
exports.selectUserIsAuthenticated = selectUserIsAuthenticated;
exports.selectUserIsLoading = selectUserIsLoading;
exports.selectUserRegistration = selectUserRegistration;
exports.selectUserRegistrationError = selectUserRegistrationError;
exports.selectUserRegistrationIsLoading = selectUserRegistrationIsLoading;
exports.selectUserRegistrationIsSuccess = selectUserRegistrationIsSuccess;
exports.userSelectors = userSelectors;
//# sourceMappingURL=selectors-f89efb18.js.map
