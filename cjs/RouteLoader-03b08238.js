'use strict';

var React = require('react');
<<<<<<< HEAD:cjs/RouteLoader-5287f321.js
var require$$9 = require('react-router-dom');
var require$$4 = require('react-redux');
var require$$0 = require('immutable');
var routing = require('./routing-b229b3c4.js');
var require$$11 = require('react-router-config');
var require$$10 = require('react-hot-loader');
=======
var reactRouterDom = require('react-router-dom');
var reactRedux = require('react-redux');
var selectors = require('./selectors-0fe2c691.js');
var routing = require('./routing-1f9fac1b.js');
var ToJs = require('./ToJs-d548b71b.js');
var reactRouterConfig = require('react-router-config');
var reactHotLoader = require('react-hot-loader');
>>>>>>> isomorphic-base:cjs/RouteLoader-03b08238.js
var PropTypes = require('prop-types');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var PropTypes__default = /*#__PURE__*/_interopDefaultLegacy(PropTypes);

const NotFound = () => React__default['default'].createElement(React__default['default'].Fragment, null, React__default['default'].createElement("header", null, React__default['default'].createElement("h1", null, "404 Page Not Found")));

const Status = ({
  code,
  children
}) => {
  return React__default['default'].createElement(require$$9.Route, {
    render: ({
      staticContext
    }) => {
      if (staticContext) staticContext.status = code;
      return children;
    }
  });
};
Status.propTypes = {
  code: PropTypes__default['default'].number.isRequired,
  children: PropTypes__default['default'].element
};

const toJS = WrappedComponent => wrappedComponentProps => {
  const KEY = 0;
  const VALUE = 1;
  const propsJS = Object.entries(wrappedComponentProps).reduce((newProps, wrappedComponentProp) => {
    newProps[wrappedComponentProp[KEY]] = require$$0.Iterable.isIterable(wrappedComponentProp[VALUE]) ? wrappedComponentProp[VALUE].toJS() : wrappedComponentProp[VALUE];
    return newProps;
  }, {});
  return React__default['default'].createElement(WrappedComponent, propsJS);
};

const getTrimmedPath = path => {
  if (path !== '/') {
    const lastChar = path[path.length - 1];

    if (lastChar == '/') {
      return path.substring(0, path.length - 1);
    }
  }

  return path;
};

const RouteLoader = ({
  statePath,
  projectId,
  contentTypeId,
  entry,
  isLoading,
  isLoggedIn,
  isNotFound,
  loadingComponent,
  mappedEntry,
  notFoundComponent,
  setNavigationPath,
  routes,
  withEvents
}) => {
  const location = require$$9.useLocation(); // Match any Static Routes a developer has defined

  const matchedStaticRoute = () => require$$11.matchRoutes(routes.StaticRoutes, location.pathname);

  const isStaticRoute = () => matchedStaticRoute().length > 0;

  const trimmedPath = getTrimmedPath(location.pathname);
  const staticRoute = isStaticRoute() && matchedStaticRoute()[0];
  const setPath = React.useCallback(() => {
    let serverPath = null;

    if (staticRoute && staticRoute.match && staticRoute.match.isExact) {
      serverPath = staticRoute.route.path.split('/').filter(p => !p.startsWith(':')).join('/');
    }

    setNavigationPath(serverPath || trimmedPath, location, staticRoute, withEvents, statePath, routes); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setNavigationPath, // staticRoute,
  withEvents, location, routes, // statePath,
  trimmedPath]);
  if (typeof window == 'undefined') setPath();
  React.useEffect(() => {
    setPath();
  }, [location, setPath]); // Need to redirect when url endswith a /

  if (location.pathname.length > trimmedPath.length) {
    return React__default['default'].createElement(require$$9.Redirect, {
      to: trimmedPath
    });
  } // Render any Static Routes a developer has defined


  if (isStaticRoute()) {
    return require$$11.renderRoutes(routes.StaticRoutes, {
      projectId,
      contentTypeId,
      entry,
      mappedEntry,
      isLoggedIn
    });
  } // Render a supplied Loading component if the route
  // is not a static route and is in a loading state


  if (isLoading && !isNotFound && loadingComponent) {
    const LoadingComponent = loadingComponent;
    return React__default['default'].createElement(LoadingComponent, null);
  } // Match any defined Content Type Mappings


  if (contentTypeId) {
    const MatchedComponent = routes.ContentTypeMappings.find(item => item.contentTypeID == contentTypeId);

    if (MatchedComponent) {
      return React__default['default'].createElement(MatchedComponent.component, {
        projectId: projectId,
        contentTypeId: contentTypeId,
        entry: entry,
        mappedEntry: mappedEntry,
        isLoggedIn: isLoggedIn
      });
    }
  }

  const NotFoundComponent = notFoundComponent ? notFoundComponent : NotFound;

  if (isNotFound) {
    return React__default['default'].createElement(Status, {
      code: 404
    }, React__default['default'].createElement(NotFoundComponent, null));
  }

  return null;
};

RouteLoader.propTypes = {
  contentTypeId: PropTypes__default['default'].string,
  entry: PropTypes__default['default'].object,
  isLoading: PropTypes__default['default'].bool,
  isLoggedIn: PropTypes__default['default'].bool,
  isNotFound: PropTypes__default['default'].bool,
  loadingComponent: PropTypes__default['default'].func,
  mappedEntry: PropTypes__default['default'].object,
  notFoundComponent: PropTypes__default['default'].func,
  projectId: PropTypes__default['default'].string,
  routes: PropTypes__default['default'].objectOf(PropTypes__default['default'].array, PropTypes__default['default'].array),
  setNavigationPath: PropTypes__default['default'].func,
  statePath: PropTypes__default['default'].string,
  withEvents: PropTypes__default['default'].object
};

const mapStateToProps = state => {
  return {
    contentTypeId: routing.selectRouteEntryContentTypeId(state),
    entry: routing.selectRouteEntry(state),
    isNotFound: routing.selectIsNotFound(state),
    isLoading: routing.selectRouteLoading(state),
    mappedEntry: routing.selectMappedEntry(state),
    projectId: routing.selectCurrentProject(state),
    statePath: routing.selectCurrentPath(state)
  };
};

const mapDispatchToProps = {
  setNavigationPath: routing.setNavigationPath
};
var RouteLoader$1 = require$$10.hot(module)(require$$4.connect(mapStateToProps, mapDispatchToProps)(toJS(RouteLoader)));

exports.RouteLoader = RouteLoader$1;
<<<<<<< HEAD:cjs/RouteLoader-5287f321.js
//# sourceMappingURL=RouteLoader-5287f321.js.map
=======
//# sourceMappingURL=RouteLoader-03b08238.js.map
>>>>>>> isomorphic-base:cjs/RouteLoader-03b08238.js
