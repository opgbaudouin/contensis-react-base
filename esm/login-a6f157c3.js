import { Seq, Map, List } from 'immutable';
import { q as queryParams, o as selectCurrentSearch, l as findContentTypeMapping, p as setRoute } from './routing-8265aea1.js';
import { takeEvery, select, call, put } from 'redux-saga/effects';
import { s as selectUserIsAuthenticated, a as selectUserGroups, m as matchUserGroup, b as selectClientCredentials } from './ToJs-1c73b10a.js';
import { Client } from 'contensis-management-api';
import mapJson from 'jsonpath-mapper';
import { to } from 'await-to-js';
import Cookies from 'js-cookie';

const fromJSOrdered = js => {
  return typeof js !== 'object' || js === null ? js : Array.isArray(js) ? Seq(js).map(fromJSOrdered).toList() : Seq(js).map(fromJSOrdered).toOrderedMap();
};

const ACTION_PREFIX = '@USER/';
const VALIDATE_USER = `${ACTION_PREFIX}VALIDATE_USER`;
const SET_AUTHENTICATION_STATE = `${ACTION_PREFIX}SET_AUTHENTICATION_STATE`;
const LOGIN_USER = `${ACTION_PREFIX}LOGIN_USER`;
const LOGIN_SUCCESSFUL = `${ACTION_PREFIX}LOGIN_SUCCESSFUL`;
const LOGIN_FAILED = `${ACTION_PREFIX}LOGIN_FAILED`;
const LOGOUT_USER = `${ACTION_PREFIX}LOGOUT_USER`;
const REGISTER_USER = `${ACTION_PREFIX}REGISTER_USER`;
const REGISTER_USER_SUCCESS = `${ACTION_PREFIX}REGISTER_USER_SUCCESS`;
const REGISTER_USER_FAILED = `${ACTION_PREFIX}REGISTER_USER_FAILED`;

var types = /*#__PURE__*/Object.freeze({
  __proto__: null,
  VALIDATE_USER: VALIDATE_USER,
  SET_AUTHENTICATION_STATE: SET_AUTHENTICATION_STATE,
  LOGIN_USER: LOGIN_USER,
  LOGIN_SUCCESSFUL: LOGIN_SUCCESSFUL,
  LOGIN_FAILED: LOGIN_FAILED,
  LOGOUT_USER: LOGOUT_USER,
  REGISTER_USER: REGISTER_USER,
  REGISTER_USER_SUCCESS: REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILED: REGISTER_USER_FAILED
});

const defaultAuthenticationState = Map({
  authenticated: false,
  authenticationError: false,
  clientCredentials: null,
  error: false,
  loading: false
});
const initialUserState = Map({
  authenticationState: defaultAuthenticationState,
  groups: new List([])
});
var UserReducer = ((state = initialUserState, action) => {
  switch (action.type) {
    case LOGIN_USER:
    case LOGOUT_USER:
    case SET_AUTHENTICATION_STATE:
      {
        if (!action.authenticationState) {
          action.authenticationState = defaultAuthenticationState.toJS();
        }

        const loading = action.type === LOGIN_USER;
        const {
          authenticationState: {
            error = false,
            authenticated,
            authenticationError = false,
            clientCredentials = null
          },
          user
        } = action;

        if (user) {
          user.name = `${user.firstName} ${user.lastName}`;
          user.isZengentiStaff = user.email.includes('@zengenti.com');
        }

        const nextState = { ...initialUserState.toJS(),
          ...(user || state.toJS()),
          authenticationState: {
            authenticated: authenticated || state.getIn(['authenticationState', 'authenticated']),
            authenticationError,
            clientCredentials,
            error,
            loading
          }
        };
        return fromJSOrdered(nextState);
      }
    // REGISTER_USER is the trigger to set the user.registration initial state
    // and will set user.registration.loading to true
    // REGISTER_USER_FAILED will unset user.registration.loading and will set
    // the value in user.registration.error
    // REGISTER_USER_SUCCESS will unset user.registration.loading and will
    // set user.registration to the created user from the api response

    case REGISTER_USER:
    case REGISTER_USER_FAILED:
    case REGISTER_USER_SUCCESS:
      {
        const {
          error,
          user
        } = action; // Set registration object from the supplied action.user
        // so we can call these values back later

        const nextState = state.set('registration', user ? fromJSOrdered(user) : state.get('registration', Map())); // Set registration flags so the UI can track the status

        return nextState.setIn(['registration', 'success'], action.type === REGISTER_USER_SUCCESS).setIn(['registration', 'error'], error || false).setIn(['registration', 'loading'], action.type === REGISTER_USER);
      }

    default:
      return state;
  }
});

const getManagementApiClient = ({
  bearerToken,
  bearerTokenExpiryDate,
  refreshToken,
  refreshTokenExpiryDate,
  contensisClassicToken,
  username,
  password
}) => {
  const rootUrl = SERVERS.api || SERVERS.cms;
  /* global SERVERS */

  const projectId = PROJECTS[0].id;
  /* global PROJECTS */

  let config = {};

  if (refreshToken) {
    config = {
      clientType: 'contensis_classic_refresh_token',
      clientDetails: {
        refreshToken
      }
    };
  } else {
    config = {
      clientType: 'contensis_classic',
      clientDetails: {
        username,
        password
      }
    };
  }

  const client = Client.create({ ...config,
    projectId,
    rootUrl
  });
  if (bearerToken) client.bearerToken = bearerToken;
  if (bearerTokenExpiryDate) client.bearerTokenExpiryDate = bearerTokenExpiryDate;
  if (refreshToken) client.refreshToken = refreshToken;
  if (refreshTokenExpiryDate) client.refreshTokenExpiryDate = refreshTokenExpiryDate;
  if (contensisClassicToken) client.contensisClassicToken = contensisClassicToken;
  return client;
};

const clientCredentials = {
  bearerToken: 'bearerToken',
  bearerTokenExpiryDate: ({
    bearerTokenExpiryDate
  }) => bearerTokenExpiryDate.toISOString(),
  refreshToken: 'refreshToken',
  refreshTokenExpiryDate: ({
    refreshTokenExpiryDate
  }) => refreshTokenExpiryDate.toISOString(),
  contensisClassicToken: 'contensisClassicToken'
};
var mapClientCredentials = (obj => mapJson(obj, clientCredentials));

const COOKIE_VALID_DAYS = 1; // 0 = Session cookie
// Override the default js-cookie conversion / encoding
// methods so the written values work with Contensis sites

const _cookie = Cookies.withConverter({
  read: value => decodeURIComponent(value),
  write: value => encodeURIComponent(value)
});

class CookieHelper {
  static GetCookie(name) {
    let cookie = _cookie.get(name);

    if (typeof cookie == 'undefined') {
      return null;
    }

    return cookie;
  }

  static SetCookie(name, value, maxAgeDays = COOKIE_VALID_DAYS) {
    maxAgeDays === 0 ? _cookie.set(name, value) : _cookie.set(name, value, {
      expires: maxAgeDays
    });
  }

  static DeleteCookie(name) {
    _cookie.remove(name);
  }

}

const context = typeof window != 'undefined' ? window : global;
const requireOidc = process.env.NODE_ENV === 'development' ? WSFED_LOGIN === 'true'
/* global WSFED_LOGIN */
: context.WSFED_LOGIN === 'true';
const servers = SERVERS;
/* global SERVERS */

const userManagerConfig = typeof window !== 'undefined' ? {
  authority: `${servers.cms}/authenticate/`,
  client_id: 'WebsiteAdfsClient',
  redirect_uri: window.location.toString(),
  post_logout_redirect_uri: window.location.toString(),
  response_type: 'id_token',
  scope: 'openid',
  filterProtocolClaims: false
} : {};

const createUserManager = config => {
  if (typeof window !== 'undefined' && requireOidc) {
    try {
      const UserManager = require('oidc-client').UserManager;

      return new UserManager(config);
    } catch (e) {//
    }
  } else return {};
};

const userManager = createUserManager(userManagerConfig);

/* eslint-disable require-atomic-updates */
const LOGIN_COOKIE = 'ContensisCMSUserName';
const REFRESH_TOKEN_COOKIE = 'RefreshToken';
const context$1 = typeof window != 'undefined' ? window : global;
class LoginHelper {
  static SetLoginCookies({
    contensisClassicToken,
    refreshToken
  }) {
    if (contensisClassicToken) CookieHelper.SetCookie(LOGIN_COOKIE, contensisClassicToken);
    if (refreshToken) CookieHelper.SetCookie(REFRESH_TOKEN_COOKIE, refreshToken);
  }

  static GetCachedCredentials() {
    return {
      bearerToken: null,
      bearerTokenExpiryDate: null,
      refreshToken: CookieHelper.GetCookie(REFRESH_TOKEN_COOKIE),
      refreshTokenExpiryDate: null,
      contensisClassicToken: CookieHelper.GetCookie(LOGIN_COOKIE)
    };
  }

  static ClearCachedCredentials() {
    CookieHelper.DeleteCookie(LOGIN_COOKIE);
    CookieHelper.DeleteCookie(REFRESH_TOKEN_COOKIE);
  }

  static async LoginUser({
    username,
    password,
    clientCredentials
  }) {
    let credentials = clientCredentials;
    let authenticationState = {
      authenticated: false,
      authenticationError: false,
      error: false,
      clientCredentials: null
    };
    let transientClient;
    let user;

    if (username && password) {
      // Get a management client with username and password
      transientClient = getManagementApiClient({
        username,
        password
      }); // Ensure the client has requested a bearer token

      const [loginError, clientBearerToken] = await to(transientClient.ensureBearerToken()); // Problem getting token with username and password

      if (loginError) {
        const authenticationError = loginError.name.includes('ContensisAuthenticationError');
        authenticationState = {
          authenticated: false,
          authenticationError: authenticationError,
          error: !authenticationError,
          clientCredentials: null
        };
        LoginHelper.ClearCachedCredentials();
      } // Got a token using username and password


      if (clientBearerToken) {
        // Set credentials so we can continue to GetUserDetails
        credentials = mapClientCredentials(transientClient);
        LoginHelper.SetLoginCookies(credentials);
        authenticationState = {
          authenticated: true,
          authenticationError: false,
          error: false,
          clientCredentials: credentials
        };
      }
    } // If we have credentials supplied by a successful username and password login
    // or clientCredentials supplied in the options argument we can continue to
    // fetch the user's details


    if (credentials) {
      const client = transientClient || getManagementApiClient(credentials);
      const [error, userDetails] = await LoginHelper.GetUserDetails(client);

      if (error) {
        authenticationState = {
          authenticated: false,
          authenticationError: false,
          error: {
            message: error.message,
            stack: error.stack
          },
          clientCredentials: null
        };
        LoginHelper.ClearCachedCredentials();
      } else {
        user = userDetails;
        authenticationState = {
          authenticated: true,
          authenticationError: false,
          error: false,
          clientCredentials: credentials
        };
      }
    }

    return {
      authenticationState,
      user
    };
  }

  static LogoutUser(redirectPath) {
    LoginHelper.ClearCachedCredentials();

    if (LoginHelper.WSFED_LOGIN) {
      LoginHelper.WsFedLogout(redirectPath);
    } else {
      if (redirectPath) LoginHelper.ClientRedirectToPath(redirectPath);else LoginHelper.ClientRedirectToSignInPage();
    }
  }

  static ClientRedirectToHome(location) {
    if (typeof window != 'undefined') {
      let url = '/';

      if (location) {
        const {
          search,
          hash
        } = location.toJS();
        url = search ? `${url}${search}` : url;
        url = hash ? `${url}${hash}` : url;
      }

      window.location.href = url;
    }
  }

  static async ClientRedirectToSignInPage(redirectPath) {
    if (LoginHelper.WSFED_LOGIN) {
      await LoginHelper.WsFedLogout();
      LoginHelper.WsFedLogin();
    } else {
      // Standard Contensis Login
      let url = LoginHelper.LOGIN_ROUTE;
      if (typeof redirectPath === 'string') url = `${url}?redirect_uri=${redirectPath}`;
      if (typeof location !== 'undefined' && redirectPath !== LoginHelper.LOGIN_ROUTE) location.replace(url);
    }
  }

  static ClientRedirectToAccessDeniedPage(originalPath) {
    let url = LoginHelper.ACCESS_DENIED_ROUTE;
    if (originalPath === url) return;
    if (typeof originalPath === 'string') url = `${url}?original_uri=${originalPath}`;
    if (typeof location !== 'undefined') location.href = url;
  }

  static ClientRedirectToPath(redirectPath) {
    if (typeof redirectPath === 'string') {
      if (typeof location !== 'undefined') window.location.href = redirectPath;
    } else LoginHelper.ClientRedirectToHome();
  }

  static WsFedLogin(redirectUri) {
    userManager.signinRedirect({
      scope: 'openid',
      response_type: 'id_token',
      redirect_uri: redirectUri || window.location.toString()
    });
  }

  static async WsFedLogout(redirectPath) {
    await fetch(`${LoginHelper.CMS_URL}/authenticate/logout?jsonResponseRequired=true`, {
      credentials: 'include'
    });

    if (redirectPath) {
      window.location = redirectPath;
    }
  }

  static async GetCredentialsForSecurityToken(securityToken) {
    const [error, response] = await to(fetch(`${LoginHelper.CMS_URL}/REST/Contensis/Security/IsAuthenticated`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        securityToken: encodeURIComponent(securityToken)
      })
    }));
    if (error) return [{
      message: 'Failed to fetch credentials'
    }];

    if (response.ok) {
      const [parseError, body] = await to(response.json());
      if (parseError) return [parseError];
      const {
        LogonResult,
        ApplicationData = []
      } = body;

      if (LogonResult !== 0) {
        return [{
          message: 'Security token is invalid',
          data: ApplicationData
        }];
      }

      if (ApplicationData.length > 1 && ApplicationData[1].Key === 'ContensisSecurityRefreshToken') {
        const refreshToken = ApplicationData[1].Value;
        return [undefined, refreshToken];
      } else {
        return [{
          message: 'Fetch credentials: Unable to find ContensisSecurityRefreshToken'
        }];
      }
    } else {
      return [{
        message: `Fetch credentials error: ${response.status} ${response.statusText}`
      }];
    }
  }

  static isZengentiStaff(email) {
    const emailRefs = ['@zengenti', '@contensis'];
    return emailRefs.some(emailRef => {
      if (email.includes(emailRef)) {
        return true;
      }
    });
  }

}
LoginHelper.CMS_URL = SERVERS.cms
/* global SERVERS */
;
LoginHelper.WSFED_LOGIN = process.env.NODE_ENV === 'development' ? WSFED_LOGIN === 'true'
/* global WSFED_LOGIN */
: context$1.WSFED_LOGIN === 'true';
LoginHelper.LOGIN_ROUTE = '/account/login';
LoginHelper.ACCESS_DENIED_ROUTE = '/account/access-denied';

LoginHelper.GetUserDetails = async client => {
  let userError,
      groupsError,
      user = {},
      groupsResult;
  [userError, user] = await to(client.security.users.getCurrent());

  if (user && user.id) {
    [groupsError, groupsResult] = await to(client.security.users.getUserGroups({
      userId: user.id,
      includeInherited: true
    })); // Set groups attribute in user object to be the items
    // array from the getUserGroups result

    if (groupsResult && groupsResult.items) user.groups = groupsResult.items; //If groups call fails then log the error but allow the user to login still
    // eslint-disable-next-line no-console

    if (groupsError) console.log(groupsError);
  }

  return [userError, user];
};

const loginSagas = [takeEvery(LOGIN_USER, loginUserSaga), takeEvery(LOGOUT_USER, logoutUserSaga), takeEvery(VALIDATE_USER, validateUserSaga), takeEvery(SET_AUTHENTICATION_STATE, redirectAfterSuccessfulLoginSaga)];
function* handleRequiresLoginSaga(action) {
  const {
    entry,
    requireLogin,
    routes: {
      ContentTypeMappings
    },
    staticRoute
  } = action;
  let userLoggedIn = yield select(selectUserIsAuthenticated); // Check for a securityToken in querystring

  const currentQs = queryParams((yield select(selectCurrentSearch)));
  const securityToken = currentQs.securityToken || currentQs.securitytoken; // Check if any of the defined routes have "requireLogin" attribute

  const {
    requireLogin: authRoute
  } = staticRoute && staticRoute.route || {};
  const {
    requireLogin: authContentType
  } = entry && findContentTypeMapping(ContentTypeMappings, entry.sys.contentTypeId) || {}; // If requireLogin, authRoute or authContentType has been specified as an
  // array of groups we can merge all the arrays and match on any group supplied

  const routeRequiresGroups = [...(Array.isArray(authContentType) && authContentType || []), ...(Array.isArray(authRoute) && authRoute || []), ...(Array.isArray(requireLogin) && requireLogin || [])];
  const routeRequiresLogin = !!authContentType || !!authRoute || !!requireLogin;

  if (!userLoggedIn) {
    // If cookies or securityToken are found on any route change
    // always validate and login the user
    if (routeRequiresLogin) {
      // If routeRequiresLogin do a blocking call that returns userLoggedIn
      userLoggedIn = yield call(validateUserSaga, {
        securityToken
      });
    } // otherwise do a non blocking put to handle validation in the background
    else yield put({
        type: VALIDATE_USER,
        securityToken
      });
  }

  if (routeRequiresLogin) {
    // If a security token is in the querystring and we are not already
    // logged in something is wrong and we won't bother going on another redirect loop
    if (!userLoggedIn && !securityToken) {
      LoginHelper.ClientRedirectToSignInPage(action.location.pathname);
    } else if (routeRequiresGroups.length > 0) {
      const userGroups = (yield select(selectUserGroups)).toJS();
      const groupMatch = matchUserGroup(userGroups, routeRequiresGroups);
      if (!groupMatch) LoginHelper.ClientRedirectToAccessDeniedPage(action.location.pathname);
    }
  }
}

function* validateUserSaga({
  securityToken
}) {
  if (securityToken) {
    // If we have just a security token we will call a CMS endpoint
    // and provide us with a RefreshToken cookie we can use during login
    const [error, refreshToken] = yield LoginHelper.GetCredentialsForSecurityToken(securityToken);
    if (refreshToken) LoginHelper.SetLoginCookies({
      contensisClassicToken: securityToken,
      refreshToken
    });
    if (error) yield put({
      type: SET_AUTHENTICATION_STATE,
      authenticationState: {
        error: {
          message: error.message,
          stack: error.stack
        }
      }
    });
  } // Check for refreshToken in cookies


  const clientCredentials = LoginHelper.GetCachedCredentials(); // Log the user in if a refreshToken is found

  if (clientCredentials.refreshToken) yield call(loginUserSaga, {
    clientCredentials
  }); // Tell any callers have we successfully logged in?

  return yield select(selectUserIsAuthenticated);
}

function* loginUserSaga(action = {}) {
  const {
    username,
    password,
    clientCredentials
  } = action; // If a WSFED_LOGIN site has dispatched the loginUser action
  // just redirect them to the Identity Provider sign in

  if (action.type === LOGIN_USER && LoginHelper.WSFED_LOGIN) LoginHelper.ClientRedirectToSignInPage();
  const {
    authenticationState,
    user
  } = yield LoginHelper.LoginUser({
    username,
    password,
    clientCredentials
  });
  yield put({
    type: SET_AUTHENTICATION_STATE,
    authenticationState,
    user
  });
}

function* redirectAfterSuccessfulLoginSaga() {
  const isLoggedIn = yield select(selectUserIsAuthenticated);
  const redirectPath = queryParams((yield select(selectCurrentSearch))).redirect_uri;

  if (isLoggedIn && redirectPath) {
    yield put(setRoute(redirectPath));
  }
}

function* logoutUserSaga({
  redirectPath
}) {
  yield put({
    type: SET_AUTHENTICATION_STATE,
    user: null
  });
  yield LoginHelper.LogoutUser(redirectPath);
}

function* refreshSecurityToken() {
  const clientCredentials = ((yield select(selectClientCredentials)) || Map()).toJS();

  if (Object.keys(clientCredentials).length > 0) {
    const client = getManagementApiClient(clientCredentials);
    yield client.authenticate();
    const authenticationState = {};
    const newClientCredentials = mapClientCredentials(client);
    authenticationState.clientCredentials = newClientCredentials;
    yield put({
      type: SET_AUTHENTICATION_STATE,
      authenticationState
    });
  }
}

export { LOGIN_USER as L, REGISTER_USER as R, UserReducer as U, REGISTER_USER_SUCCESS as a, REGISTER_USER_FAILED as b, LOGOUT_USER as c, LoginHelper as d, fromJSOrdered as f, handleRequiresLoginSaga as h, initialUserState as i, loginSagas as l, refreshSecurityToken as r, types as t };
//# sourceMappingURL=login-a6f157c3.js.map