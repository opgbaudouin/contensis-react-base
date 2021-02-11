'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('react');
var reactRedux = require('react-redux');
require('immutable');
var reducers = require('./reducers-0387eb16.js');
require('./selectors-975b9ec9.js');
require('query-string');
require('@redux-saga/core/effects');
var selectors = require('./selectors-f89efb18.js');
var login = require('./login-bf48d1e9.js');
require('jsonpath-mapper');
require('await-to-js');
require('js-cookie');
var ToJs = require('./ToJs-4e6462a1.js');
var actions = require('./actions-ddd061c7.js');

const useLogin = () => {
  const dispatch = reactRedux.useDispatch();
  const select = reactRedux.useSelector;
  return {
    loginUser: (username, password) => dispatch(actions.loginUser(username, password)),
    logoutUser: redirectPath => dispatch(actions.logoutUser(redirectPath)),
    authenticationError: select(selectors.selectUserAuthenticationError),
    error: select(selectors.selectUserError),
    isAuthenticated: select(selectors.selectUserIsAuthenticated),
    isLoading: select(selectors.selectUserIsLoading),
    user: select(selectors.selectUser).toJS()
  };
};

const LoginContainer = ({
  children,
  ...props
}) => {
  const userProps = useLogin();
  return children(userProps);
};

LoginContainer.propTypes = {};
var Login_container = ToJs.toJS(LoginContainer);

const useLogin$1 = () => {
  const dispatch = reactRedux.useDispatch();
  const select = reactRedux.useSelector;
  return {
    registerUser: (user, mappers) => dispatch(actions.registerUser(user, mappers)),
    error: select(selectors.selectUserRegistrationError),
    isLoading: select(selectors.selectUserRegistrationIsLoading),
    isSuccess: select(selectors.selectUserRegistrationIsSuccess),
    user: select(selectors.selectUserRegistration).toJS()
  };
};

const RegistrationContainer = ({
  children,
  ...props
}) => {
  const userProps = useLogin$1();
  return children(userProps);
};

RegistrationContainer.propTypes = {};
var Registration_container = ToJs.toJS(RegistrationContainer);

const getDisplayName = WrappedComponent => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

const withLogin = WrappedComponent => {
  // Returns a redux-connected component with the following props:
  // this.propTypes = {
  //   loading: PropTypes.bool,
  //   authenticated: PropTypes.bool,
  //   authenticationError: PropTypes.bool,
  //   error: PropTypes.bool,
  //   user: PropTypes.object,
  //   logoutUser: PropTypes.func,
  //   isHeaderLogin: PropTypes.bool,
  // };
  const mapStateToProps = state => {
    return {
      authenticationError: selectors.selectUserAuthenticationError(state),
      error: selectors.selectUserError(state),
      isAuthenticated: selectors.selectUserIsAuthenticated(state),
      isLoading: selectors.selectUserIsLoading(state),
      user: selectors.selectUser(state)
    };
  };

  const mapDispatchToProps = {
    loginUser: actions.loginUser,
    logoutUser: actions.logoutUser
  };
  const ConnectedComponent = reactRedux.connect(mapStateToProps, mapDispatchToProps)(ToJs.toJS(WrappedComponent));
  ConnectedComponent.displayName = `${getDisplayName(WrappedComponent)}`;
  return ConnectedComponent;
};

const getDisplayName$1 = WrappedComponent => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

const withRegistration = WrappedComponent => {
  // Returns a redux-connected component with the following props:
  // this.propTypes = {
  //   registerUser: PropTypes.func,
  //   isLoading: PropTypes.bool,
  //   isSuccess: PropTypes.bool,
  //   error: PropTypes.bool | PropTypes.object,
  //   user: PropTypes.object,
  // };
  const mapStateToProps = state => {
    return {
      error: selectors.selectUserRegistrationError(state),
      isLoading: selectors.selectUserRegistrationIsLoading(state),
      isSuccess: selectors.selectUserRegistrationIsSuccess(state),
      user: selectors.selectUserRegistration(state)
    };
  };

  const mapDispatchToProps = {
    registerUser: actions.registerUser
  };
  const ConnectedComponent = reactRedux.connect(mapStateToProps, mapDispatchToProps)(ToJs.toJS(WrappedComponent));
  ConnectedComponent.displayName = `${getDisplayName$1(WrappedComponent)}`;
  return ConnectedComponent;
};

exports.initialUserState = reducers.initialUserState;
exports.reducer = reducers.UserReducer;
exports.types = reducers.userTypes;
exports.selectors = selectors.userSelectors;
exports.LoginHelper = login.LoginHelper;
exports.handleRequiresLoginSaga = login.handleRequiresLoginSaga;
exports.refreshSecurityToken = login.refreshSecurityToken;
exports.actions = actions.userActions;
exports.LoginContainer = Login_container;
exports.RegistrationContainer = Registration_container;
exports.useLogin = useLogin;
exports.useRegistration = useLogin$1;
exports.withLogin = withLogin;
exports.withRegistration = withRegistration;
//# sourceMappingURL=user.js.map
