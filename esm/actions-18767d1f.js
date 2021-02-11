import { L as LOGIN_USER, c as LOGOUT_USER, R as REGISTER_USER } from './reducers-9336f64f.js';
import { y as action } from './selectors-10d55d92.js';

const loginUser = (username, password) => action(LOGIN_USER, {
  username,
  password
});
const logoutUser = redirectPath => action(LOGOUT_USER, {
  redirectPath
});
const registerUser = (user, mappers) => action(REGISTER_USER, {
  user,
  mappers
});

var userActions = /*#__PURE__*/Object.freeze({
  __proto__: null,
  loginUser: loginUser,
  logoutUser: logoutUser,
  registerUser: registerUser
});

export { logoutUser as a, loginUser as l, registerUser as r, userActions as u };
//# sourceMappingURL=actions-18767d1f.js.map
