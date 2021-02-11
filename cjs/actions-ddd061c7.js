'use strict';

var reducers = require('./reducers-0387eb16.js');
var selectors = require('./selectors-975b9ec9.js');

const loginUser = (username, password) => selectors.action(reducers.LOGIN_USER, {
  username,
  password
});
const logoutUser = redirectPath => selectors.action(reducers.LOGOUT_USER, {
  redirectPath
});
const registerUser = (user, mappers) => selectors.action(reducers.REGISTER_USER, {
  user,
  mappers
});

var userActions = /*#__PURE__*/Object.freeze({
  __proto__: null,
  loginUser: loginUser,
  logoutUser: logoutUser,
  registerUser: registerUser
});

exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
exports.registerUser = registerUser;
exports.userActions = userActions;
//# sourceMappingURL=actions-ddd061c7.js.map
