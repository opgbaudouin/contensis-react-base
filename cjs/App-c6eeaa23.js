'use strict';

var React = require('react');
var require$$0 = require('immutable');
var history$1 = require('history');
<<<<<<< HEAD:cjs/App-29c48e39.js
var require$$2 = require('contensis-delivery-api');
var routing = require('./routing-b229b3c4.js');
=======
var contensisDeliveryApi = require('contensis-delivery-api');
var selectors = require('./selectors-0fe2c691.js');
var navigation = require('./navigation-d1239577.js');
>>>>>>> isomorphic-base:cjs/App-c6eeaa23.js
var redux = require('redux');
var reduxImmutable = require('redux-immutable');
var thunk = require('redux-thunk');
var createSagaMiddleware = require('redux-saga');
<<<<<<< HEAD:cjs/App-29c48e39.js
var navigation = require('./navigation-8a94ff72.js');
=======
var sagas = require('./sagas-6cbd425c.js');
>>>>>>> isomorphic-base:cjs/App-c6eeaa23.js
var effects = require('redux-saga/effects');
var require$$7 = require('loglevel');
require('react-hot-loader');
<<<<<<< HEAD:cjs/App-29c48e39.js
var RouteLoader = require('./RouteLoader-5287f321.js');
=======
var RouteLoader = require('./RouteLoader-03b08238.js');
>>>>>>> isomorphic-base:cjs/App-c6eeaa23.js

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var thunk__default = /*#__PURE__*/_interopDefaultLegacy(thunk);
var createSagaMiddleware__default = /*#__PURE__*/_interopDefaultLegacy(createSagaMiddleware);

const selectedHistory = typeof window !== 'undefined' ? history$1.createBrowserHistory : history$1.createMemoryHistory;
const history = (options = {}) => selectedHistory(options);
const browserHistory = selectedHistory();

const servers = SERVERS;
/* global SERVERS */

const alias = servers.alias.toLowerCase();
const publicUri = PUBLIC_URI;
/* global PUBLIC_URI */

const projects = PROJECTS;
/* global PROJECTS */
// return a projectId via the request hostname

const pickProject = (hostname, query) => {
  // if localhost we can only infer via a querystring, and take your word for it
  if (hostname == 'localhost') {
    return query && query.p || projects[0].id;
  } // if hostname is the actual public uri we can return the first project from the list


  if (hostname == publicUri) {
    return projects[0].id;
  }

  let project = 'unknown'; // // go through all the defined projects
  // Object.entries(projects).map(([, p]) => {

  const p = projects[0]; // check if we're accessing via the project's public uri

  if (hostname.includes(p.publicUri)) project = p.id; // the url structure is different for website (we don't prefix)

  if (p.id.startsWith('website')) {
    // check for internal and external hostnames
    // we check live and preview distinctly so our rule does not clash with
    // hostnames that use a project prefix
    if (hostname.includes(`live-${alias}.cloud.contensis.com`) || hostname.includes(`live.${alias}.contensis.cloud`) || hostname.includes(`preview-${alias}.cloud.contensis.com`) || hostname.includes(`preview.${alias}.contensis.cloud`)) project = p.id;
  } else {
    // check for internal and external hostnames, prefixed with the projectId
    if (hostname.includes(`${p.id.toLowerCase()}-${alias}.cloud.contensis.com`) || hostname.includes(`${p.id.toLowerCase()}.${alias}.contensis.cloud`)) project = p.id;
  } // });


  return project === 'unknown' ? p.id : project;
};

let initialState = require$$0.Map({
  currentPath: '/',
  currentNode: [],
  currentProject: 'unknown',
  notFound: false,
  entryID: null,
  entry: null,
  contentTypeId: null,
  currentNodeAncestors: new require$$0.List(),
  currentTreeId: null
});
var RoutingReducer = ((state = initialState, action) => {
  switch (action.type) {
    case routing.MAP_ENTRY:
      {
        return state.set('mappedEntry', require$$0.fromJS(action.mappedEntry));
      }

    case routing.SET_ANCESTORS:
      {
        if (action.ancestors) {
          return state.set('currentNodeAncestors', require$$0.fromJS(action.ancestors));
        }

        return state.set('currentNodeAncestors', require$$0.fromJS(action.ancestors));
      }

    case routing.SET_ENTRY:
      {
        const {
          entry,
          node = {},
          isLoading = false,
          notFound
        } = action;
        let nextState;

        if (!entry) {
          nextState = state.set('entryID', null).set('entry', null).set('mappedEntry', null).set('isLoading', isLoading).set('notFound', notFound);
        } else {
          nextState = state.set('entryID', action.id).set('entry', require$$0.fromJS(entry)).set('isLoading', isLoading).set('notFound', notFound);
        }

        if (!node) {
          return nextState.set('nodeDepends', null).set('currentNode', null);
        } else {
          // On Set Node, we reset all dependants.
          return nextState.set('currentNode', require$$0.fromJS(node)).removeIn(['currentNode', 'entry']); // We have the entry stored elsewhere, so lets not keep it twice.
        }
      }

    case routing.SET_NAVIGATION_PATH:
      {
        let staticRoute = false;

        if (action.staticRoute) {
          staticRoute = { ...action.staticRoute
          };
        }

        if (action.path) {
          // Don't run a path update on iniutial load as we allready should have it in redux
          const entryUri = state.getIn(['entry', 'sys', 'uri']);

          if (entryUri != action.path) {
            return state.set('currentPath', require$$0.fromJS(action.path)).set('location', require$$0.fromJS(action.location)).set('staticRoute', require$$0.fromJS({ ...staticRoute,
              route: { ...staticRoute.route,
                component: null
              }
            })).set('isLoading', typeof window !== 'undefined');
          } else {
            return state.set('location', require$$0.fromJS(action.location)).set('staticRoute', require$$0.fromJS({ ...staticRoute,
              route: { ...staticRoute.route,
                component: null
              }
            }));
          }
        }

        return state;
      }
    // case SET_NAVIGATION_NOT_FOUND: {
    //   return state
    //     .set('notFound', fromJS(action.notFound))
    //     .set('isLoading', false);
    // }
    // case SET_NODE: {
    //   const { node } = action;
    //   if (!node) return state;
    //   // On Set Node, we reset all dependants.
    //   const nodeDepends = Set([node.id]);
    //   return state
    //     .set('nodeDepends', nodeDepends)
    //     .set('currentNode', fromJS(action.node))
    //     .removeIn(['currentNode', 'entry']); // We have the entry stored elsewhere, so lets not keep it twice.
    // }

    case routing.SET_ROUTE:
      {
        return state.set('nextPath', action.path);
      }

    case routing.SET_SIBLINGS:
      {
        // Can be null in some cases like the homepage.
        let currentNodeSiblingParent = null;
        let siblingIDs = [];

        if (action.siblings && action.siblings.length > 0) {
          currentNodeSiblingParent = action.siblings[0].parentId;
          siblingIDs = action.siblings.map(node => {
            return node.id;
          });
        }

        let currentNodeDepends = state.get('nodeDepends');
        const allNodeDepends = require$$0.Set.union([require$$0.Set(siblingIDs), currentNodeDepends]);
        return state.set('nodeDepends', allNodeDepends).set('currentNodeSiblings', require$$0.fromJS(action.siblings)).set('currentNodeSiblingsParent', currentNodeSiblingParent);
      }

    case routing.SET_SURROGATE_KEYS:
      {
        return state.set('surrogateKeys', action.keys);
      }

    case routing.SET_TARGET_PROJECT:
      {
        return state.set('currentProject', action.project).set('currentTreeId', '') //getTreeID(action.project))
        .set('allowedGroups', require$$0.fromJS(action.allowedGroups));
      }

    default:
      return state;
  }
});

let initialState$1 = require$$0.Map({
  commitRef: null,
  buildNo: null,
  contensisVersionStatus: 'published'
});
var VersionReducer = ((state = initialState$1, action) => {
  switch (action.type) {
    case navigation.SET_VERSION_STATUS:
      {
        return state.set('contensisVersionStatus', action.status);
      }

    case navigation.SET_VERSION:
      {
        return state.set('commitRef', action.commitRef).set('buildNo', action.buildNo);
      }

    default:
      return state;
  }
});

const initialState$2 = require$$0.Map({
  root: null,
  treeDepends: new require$$0.List([]),
  isError: false,
  isReady: false
});
var NavigationReducer = ((state = initialState$2, action) => {
  switch (action.type) {
    case navigation.SET_NODE_TREE:
      {
        return state.set('root', require$$0.fromJS(action.nodes)).set('isReady', true);
      }

    case navigation.GET_NODE_TREE_ERROR:
      {
        return state.set('isError', true);
      }

    default:
      return state;
  }
});

/**
 * This middleware captures CALL_HISTORY_METHOD actions to redirect to the
 * provided history object. This will prevent these actions from reaching your
 * reducer or any middleware that comes after this one.
 */

/* eslint-disable no-unused-vars */

const routerMiddleware = history => store => next => action => {
  if (action.type !== routing.CALL_HISTORY_METHOD) {
    return next(action);
  }

  const {
    payload: {
      method,
      args
    }
  } = action;
  history[method](...args);
};

let reduxStore = null;
var createStore = ((featureReducers, initialState, history) => {
  const thunkMiddleware = [thunk__default['default']];

  let reduxDevToolsMiddleware = f => f;

  if (typeof window != 'undefined') {
    reduxDevToolsMiddleware = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f;
  }

  const sagaMiddleware = createSagaMiddleware__default['default']();
  const middleware = redux.compose(redux.applyMiddleware(...thunkMiddleware, sagaMiddleware, routerMiddleware(history)), reduxDevToolsMiddleware);
  let reducers = {
    navigation: NavigationReducer,
    routing: RoutingReducer,
    version: VersionReducer,
    ...featureReducers
  };
  const combinedReducers = reduxImmutable.combineReducers(reducers);

  const store = initialState => {
    const store = redux.createStore(combinedReducers, initialState, middleware);
    store.runSaga = sagaMiddleware.run;

    store.close = () => store.dispatch(createSagaMiddleware.END);

    return store;
  };

  reduxStore = store(initialState);
  return reduxStore;
});

const storeSurrogateKeys = response => {
  const keys = response.headers.get ? response.headers.get('surrogate-key') : response.headers.map['surrogate-key'];
  if (keys) reduxStore.dispatch(routing.setSurrogateKeys(keys));
};

const getClientConfig = project => {
  let config = DELIVERY_API_CONFIG;
  /* global DELIVERY_API_CONFIG */

  config.responseHandler = {};

  if (project) {
    config.projectId = project;
  } // // we only want the surrogate key header in a server context


  if (typeof window === 'undefined') {
    config.defaultHeaders = {
      'x-require-surrogate-key': true
    };
    config.responseHandler[200] = storeSurrogateKeys;
  }

  if (typeof window !== 'undefined' && PROXY_DELIVERY_API
  /* global PROXY_DELIVERY_API */
  ) {
      // ensure a relative url is used to bypass the need for CORS (separate OPTIONS calls)
      config.rootUrl = '';

      config.responseHandler[404] = () => null;
    }

  return config;
};

class DeliveryApi {
  constructor() {
    this.getClientSideVersionStatus = () => {
      if (typeof window != 'undefined') {
        const currentHostname = window.location.hostname;
        return this.getVersionStatusFromHostname(currentHostname);
      }

      return null;
    };

    this.getVersionStatusFromHostname = currentHostname => {
      if (currentHostname.indexOf('localhost') > -1) return 'latest';

      if (currentHostname.endsWith('contensis.cloud')) {
        if (currentHostname.indexOf('preview.') > -1) {
          return 'latest';
        } else {
          return 'published';
        }
      }

      if (currentHostname.endsWith('cloud.contensis.com')) {
        if (currentHostname.indexOf('preview-') > -1) {
          return 'latest';
        } else {
          return 'published';
        }
      }

      return 'published';
    };

    this.search = (query, linkDepth, project, env) => {
      const client = require$$2.Client.create(getClientConfig(project));
      return client.entries.search(query, typeof linkDepth !== 'undefined' ? linkDepth : 1);
    };

    this.getClient = (deliveryApiStatus = 'published', project, env) => {
      const baseConfig = getClientConfig(project);
      baseConfig.versionStatus = deliveryApiStatus;
      return require$$2.Client.create(baseConfig);
    };

    this.getEntry = (id, linkDepth = 0, deliveryApiStatus = 'published', project, env) => {
      const baseConfig = getClientConfig(project);
      baseConfig.versionStatus = deliveryApiStatus;
      const client = require$$2.Client.create(baseConfig); // return client.entries.get(id, linkDepth);

      return client.entries.get({
        id,
        linkDepth
      });
    };
  }

}

const deliveryApi = new DeliveryApi();

class CacheNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.next = null;
    this.prev = null;
  }

}

class LruCache {
  constructor(limit = 100) {
    this.map = {};
    this.head = null;
    this.tail = null;
    this.limit = limit || 100;
    this.size = 0;
  }

  get(key) {
    if (this.map[key]) {
      let value = this.map[key].value;
      let node = new CacheNode(key, value);
      this.remove(key);
      this.setHead(node);
      return value;
    }
  }

  set(key, value) {
    let node = new CacheNode(key, value);

    if (this.map[key]) {
      this.remove(key);
    } else {
      if (this.size >= this.limit) {
        delete this.map[this.tail.key];
        this.size--;
        this.tail = this.tail.prev;
        this.tail.next = null;
      }
    }

    this.setHead(node);
  }

  setHead(node) {
    node.next = this.head;
    node.prev = null;

    if (this.head) {
      this.head.prev = node;
    }

    this.head = node;

    if (!this.tail) {
      this.tail = node;
    }

    this.size++;
    this.map[node.key] = node;
  }

  remove(key) {
    let node = this.map[key];

    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }

    delete this.map[key];
    this.size--;
  }

}

class CachedSearch {
  constructor() {
    this.cache = new LruCache();
    this.taxonomyLookup = {};
  }

  search(query, linkDepth, project, env) {
    const client = require$$2.Client.create(getClientConfig(project));
    return this.request(project + JSON.stringify(query) + linkDepth.toString(), () => client.entries.search(query, linkDepth));
  }

  get(id, linkDepth, versionStatus, project, env) {
    const client = require$$2.Client.create(getClientConfig(project));
    client.clientConfig.versionStatus = versionStatus;
    return this.request(id, () => client.entries.get({
      id,
      linkDepth
    }));
  }

  getContentType(id, project, env) {
    const client = require$$2.Client.create(getClientConfig(project));
    return this.request(`[CONTENT TYPE] ${id} ${project}`, () => client.contentTypes.get(id));
  }

  getTaxonomyNode(key, project, env) {
    const client = require$$2.Client.create(getClientConfig(project));
    return this.request(`[TAXONOMY NODE] ${key}`, () => client.taxonomy.resolveChildren(key).then(node => this.extendTaxonomyNode(node)));
  }

  getRootNode(options, project, env) {
    const client = require$$2.Client.create(getClientConfig(project));
    return this.request(`${project} / ${JSON.stringify(options)}`, () => client.nodes.getRoot(options));
  }

  getNode(options, project, env) {
    const client = require$$2.Client.create(getClientConfig(project));
    return this.request(`${project} ${options && options.path || options} ${JSON.stringify(options)}`, () => client.nodes.get(options));
  }

  getAncestors(options, project, env) {
    const client = require$$2.Client.create(getClientConfig(project));
    return this.request(`${project} [A] ${options && options.id || options} ${JSON.stringify(options)}`, () => client.nodes.getAncestors(options));
  }

  getChildren(options, project, env) {
    const client = require$$2.Client.create(getClientConfig(project));
    return this.request(`${project} [C] ${options && options.id || options} ${JSON.stringify(options)}`, () => client.nodes.getChildren(options));
  }

  getSiblings(options, project, env) {
    const client = require$$2.Client.create(getClientConfig(project));
    return this.request(`${project} [S] ${options && options.id || options} ${JSON.stringify(options)}`, () => client.nodes.getSiblings(options));
  }

  request(key, execute) {
    if (!this.cache.get(key) || typeof window == 'undefined') {
      let promise = execute();
      this.cache.set(key, promise);
      promise.catch(() => {
        this.cache.remove(key);
      });
    }

    return this.cache.get(key);
  }

  extendTaxonomyNode(node) {
    let id = this.getTaxonomyId(node);
    this.taxonomyLookup[id] = node.key;
    return { ...node,
      id,
      children: node.children ? node.children.map(n => this.extendTaxonomyNode(n)) : null
    };
  }

  getTaxonomyId(node) {
    if (node.key) {
      let parts = node.key.split('/');
      return parts[parts.length - 1];
    }

    return '';
  }

  getTaxonomyKey(id) {
    return this.taxonomyLookup[id];
  }

}

const cachedSearch = new CachedSearch();

<<<<<<< HEAD:cjs/App-29c48e39.js
=======
let initialState = immutable.OrderedMap({
  contentTypeId: null,
  currentPath: '/',
  currentNode: [],
  currentNodeAncestors: immutable.List(),
  currentProject: 'unknown',
  currentTreeId: null,
  entry: null,
  entryDepends: immutable.List(),
  entryID: null,
  isLoading: false,
  location: null,
  mappedEntry: null,
  nodeDepends: immutable.List(),
  notFound: false,
  staticRoute: null
});
var RoutingReducer = ((state = initialState, action) => {
  switch (action.type) {
    case selectors.SET_ANCESTORS:
      {
        if (action.ancestors) {
          let ancestorIDs = action.ancestors.map(node => {
            return node.id;
          });
          let currentNodeDepends = state.get('nodeDepends');
          const allNodeDepends = immutable.Set.union([immutable.Set(ancestorIDs), currentNodeDepends]);
          return state.set('nodeDepends', allNodeDepends).set('currentNodeAncestors', immutable.fromJS(action.ancestors));
        }

        return state.set('currentNodeAncestors', immutable.fromJS(action.ancestors));
      }

    case selectors.SET_ENTRY:
      {
        const {
          entry,
          mappedEntry,
          node = {},
          isLoading = false,
          notFound = false
        } = action;
        let nextState;

        if (!entry) {
          nextState = state.set('entryID', null).set('entryDepends', null).set('entry', null).set('mappedEntry', null).set('isLoading', isLoading).set('notFound', notFound);
        } else {
          const entryDepends = GetAllResponseGuids(entry);
          nextState = state.set('entryID', action.id).set('entryDepends', immutable.fromJS(entryDepends)).set('entry', immutable.fromJS(entry)).set('isLoading', isLoading).set('notFound', notFound);
          if (mappedEntry) nextState = nextState.set('mappedEntry', immutable.fromJS(mappedEntry)).set('entry', immutable.fromJS({
            sys: entry.sys
          }));
        }

        if (!node) {
          return nextState.set('nodeDepends', null).set('currentNode', null);
        } else {
          // On Set Node, we reset all dependants.
          const nodeDepends = immutable.Set([node.id]);
          return nextState.set('nodeDepends', nodeDepends).set('currentNode', immutable.fromJS(node)).removeIn(['currentNode', 'entry']); // We have the entry stored elsewhere, so lets not keep it twice.
        }
      }

    case selectors.SET_NAVIGATION_PATH:
      {
        let staticRoute = false;

        if (action.staticRoute) {
          staticRoute = { ...action.staticRoute
          };
        }

        if (action.path) {
          // Don't run a path update on iniutial load as we allready should have it in redux
          const entryUri = state.getIn(['entry', 'sys', 'uri']);

          if (entryUri != action.path) {
            return state.set('currentPath', immutable.fromJS(action.path)).set('location', immutable.fromJS(action.location)).set('staticRoute', immutable.fromJS({ ...staticRoute,
              route: { ...staticRoute.route,
                component: null
              }
            })).set('isLoading', typeof window !== 'undefined');
          } else {
            return state.set('location', immutable.fromJS(action.location)).set('staticRoute', immutable.fromJS({ ...staticRoute,
              route: { ...staticRoute.route,
                component: null
              }
            }));
          }
        }

        return state;
      }

    case selectors.SET_ROUTE:
      {
        return state.set('nextPath', action.path);
      }

    case selectors.SET_SIBLINGS:
      {
        // Can be null in some cases like the homepage.
        let currentNodeSiblingParent = null;
        let siblingIDs = [];

        if (action.siblings && action.siblings.length > 0) {
          currentNodeSiblingParent = action.siblings[0].parentId;
          siblingIDs = action.siblings.map(node => {
            return node.id;
          });
        }

        let currentNodeDepends = state.get('nodeDepends');
        const allNodeDepends = immutable.Set.union([immutable.Set(siblingIDs), currentNodeDepends]);
        return state.set('nodeDepends', allNodeDepends).set('currentNodeSiblings', immutable.fromJS(action.siblings)).set('currentNodeSiblingsParent', currentNodeSiblingParent);
      }

    case selectors.SET_TARGET_PROJECT:
      {
        return state.set('currentProject', action.project).set('currentTreeId', '') //getTreeID(action.project))
        .set('allowedGroups', immutable.fromJS(action.allowedGroups));
      }

    default:
      return state;
  }
});

let initialState$1 = immutable.Map({
  commitRef: null,
  buildNo: null,
  contensisVersionStatus: 'published'
});
var VersionReducer = ((state = initialState$1, action) => {
  switch (action.type) {
    case navigation.SET_VERSION_STATUS:
      {
        return state.set('contensisVersionStatus', action.status);
      }

    case navigation.SET_VERSION:
      {
        return state.set('commitRef', action.commitRef).set('buildNo', action.buildNo);
      }

    default:
      return state;
  }
});

const initialState$2 = immutable.Map({
  root: null,
  treeDepends: new immutable.List([]),
  isError: false,
  isReady: false
});
var NavigationReducer = ((state = initialState$2, action) => {
  switch (action.type) {
    case navigation.SET_NODE_TREE:
      {
        return state.set('root', immutable.fromJS(action.nodes)).set('isReady', true);
      }

    case navigation.GET_NODE_TREE_ERROR:
      {
        return state.set('isError', true);
      }

    default:
      return state;
  }
});

/**
 * This middleware captures CALL_HISTORY_METHOD actions to redirect to the
 * provided history object. This will prevent these actions from reaching your
 * reducer or any middleware that comes after this one.
 */

/* eslint-disable no-unused-vars */

const routerMiddleware = history => store => next => action => {
  if (action.type !== selectors.CALL_HISTORY_METHOD) {
    return next(action);
  }

  const {
    payload: {
      method,
      args
    }
  } = action;
  history[method](...args);
};

var createStore = ((featureReducers, initialState, history) => {
  const thunkMiddleware = [thunk__default['default']];

  let reduxDevToolsMiddleware = f => f;

  if (typeof window != 'undefined') {
    reduxDevToolsMiddleware = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f;
  }

  const sagaMiddleware = createSagaMiddleware__default['default']();
  const middleware = redux.compose(redux.applyMiddleware(...thunkMiddleware, sagaMiddleware, routerMiddleware(history)), reduxDevToolsMiddleware);
  let reducers = {
    navigation: NavigationReducer,
    routing: RoutingReducer,
    user: sagas.UserReducer,
    version: VersionReducer,
    ...featureReducers
  };
  const combinedReducers = reduxImmutable.combineReducers(reducers);

  const store = initialState => {
    const store = redux.createStore(combinedReducers, initialState, middleware);
    store.runSaga = sagaMiddleware.run;

    store.close = () => store.dispatch(createSagaMiddleware.END);

    return store;
  };

  return store(initialState);
});

>>>>>>> isomorphic-base:cjs/App-c6eeaa23.js
const sys = {
  contentTypeId: 'sys.contentTypeId',
  dataFormat: 'sys.dataFormat',
  filename: 'sys.properties.filename',
  id: 'sys.id',
  includeInSearch: 'sys.metadata.includeInSearch',
  slug: 'sys.slug',
  uri: 'sys.uri',
  versionStatus: 'sys.versionStatus'
};
const Fields = {
  entryTitle: 'entryTitle',
  entryDescription: 'entryDescription',
  keywords: 'keywords',
  sys,
  contentTypeId: 'sys.contentTypeId',
  wildcard: '*'
};

const fieldExpression = (field, value, operator = 'equalTo', weight = null) => {
  if (!field || !value) return [];
  if (Array.isArray(value)) return equalToOrIn(field, value, operator);else return !weight ? [require$$2.Op[operator](field, value)] : [require$$2.Op[operator](field, value).weight(weight)];
};
const defaultExpressions = versionStatus => {
  return [require$$2.Op.equalTo(Fields.sys.versionStatus, versionStatus)];
};

const equalToOrIn = (field, arr, operator = 'equalTo') => arr.length === 0 ? [] : arr.length === 1 ? [require$$2.Op[operator](field, arr[0])] : [require$$2.Op.in(field, ...arr)];

// eslint-disable-next-line import/named
const routeEntryByFieldsQuery = (id, fields = [], versionStatus = 'published') => {
  const query = new require$$2.Query(...[...fieldExpression('sys.id', id), ...defaultExpressions(versionStatus)]);
  query.fields = fields;
  return query;
};

const navigationSagas = [effects.takeEvery(navigation.GET_NODE_TREE, ensureNodeTreeSaga)];
function* ensureNodeTreeSaga(action) {
  const state = yield effects.select();

  try {
    if (!navigation.hasNavigationTree(state)) {
      const deliveryApiVersionStatus = yield effects.select(navigation.selectVersionStatus);
      const project = yield effects.select(routing.selectCurrentProject);
      const nodes = yield deliveryApi.getClient(deliveryApiVersionStatus, project).nodes.getRoot({
        depth: action.treeDepth || 2,
        entryFields: 'entryTitle, metaInformation, sys.contentTypeId'
      });

      if (nodes) {
        yield effects.put({
          type: navigation.SET_NODE_TREE,
          nodes
        });
      } else {
        yield effects.put({
          type: navigation.GET_NODE_TREE_ERROR
        });
      }
    }
  } catch (ex) {
    yield effects.put({
      type: navigation.GET_NODE_TREE_ERROR,
      error: ex.toString()
    });
  }
}

// load-entries.js
const routingSagas = [effects.takeEvery(routing.SET_NAVIGATION_PATH, getRouteSaga), effects.takeEvery(routing.SET_ROUTE, setRouteSaga)];
/**
 * To navigate / push a specific route via redux middleware
 * @param {path, state} action
 */

function* setRouteSaga(action) {
  yield effects.put({
    type: routing.CALL_HISTORY_METHOD,
    payload: {
      method: 'push',
      args: [action.path, action.state]
    }
  });
} // function* deliveryApiResponseHandler(response) {
//   debugger;
//   yield put({ type: 'HANDLE_RESPONSE', headers: response.headers });
// }


function* getRouteSaga(action) {
  let entry = null;

  try {
    const {
      withEvents,
      routes: {
        ContentTypeMappings = {}
      } = {},
      staticRoute
    } = action;
    let appsays;

    if (withEvents && withEvents.onRouteLoad) {
      appsays = yield withEvents.onRouteLoad(action);
    } // if appsays customNavigation: true, we will set doNavigation to false
    // if appsays customNavigation: { ... }, we will set doNavigation to the customNavigation object and check for child elements
    // if appsays nothing we will set doNavigation to true and continue to do navigation calls


    const doNavigation = !appsays || (appsays && appsays.customNavigation === true ? false : appsays && appsays.customNavigation || true);
    const entryLinkDepth = appsays && appsays.entryLinkDepth || 3;
    const setContentTypeLimits = !!ContentTypeMappings.find(ct => ct.fields || ct.linkDepth);
    const state = yield effects.select();
<<<<<<< HEAD:cjs/App-29c48e39.js
    const routeEntry = routing.selectRouteEntry(state);
    const currentPath = routing.selectCurrentPath(state);
=======
    const routeEntry = selectors.selectRouteEntry(state); // const routeNode = selectCurrentNode(state);

    const currentPath = action.path; //selectCurrentPath(state);

>>>>>>> isomorphic-base:cjs/App-c6eeaa23.js
    const deliveryApiStatus = navigation.selectVersionStatus(state);
    const project = routing.selectCurrentProject(state);
    const isHome = currentPath === '/';
    const isPreview = currentPath && currentPath.startsWith('/preview/');

    if (!isPreview && (appsays && appsays.customRouting || staticRoute && !staticRoute.route.fetchNode || routeEntry && action.statePath === action.path)) {
      // To prevent erroneous 404s and wasted network calls, this covers
      // - appsays customRouting and does SET_ENTRY etc. via the consuming app
      // - all staticRoutes (where custom 'route.fetchNode' attribute is falsey)
      // - standard Contensis SiteView Routing where we already have that entry in state
<<<<<<< HEAD:cjs/App-29c48e39.js
      if (routeEntry && (!staticRoute || staticRoute.route && staticRoute.route.fetchNode)) {//Do nothing, the entry is allready the right one.
      } else yield effects.call(setRouteEntry, null, // entry = null
      null, // pathNode = null
      null, // ancestors = null
      null, // siblings = null
      false // notFound = false
      );
=======
      if (routeEntry && (!staticRoute || staticRoute.route && staticRoute.route.fetchNode)) {
        entry = routeEntry.toJS(); //Do nothing, the entry is allready the right one.
        // yield put({
        //   type: SET_ENTRY,
        //   entry,
        //   node: routeNode,
        //   isLoading: false,
        // });
      } else yield effects.call(setRouteEntry);
>>>>>>> isomorphic-base:cjs/App-c6eeaa23.js
    } else {
      let pathNode = null,
          ancestors = null,
          siblings = null; // Handle homepage

      if (isHome) {
        pathNode = yield cachedSearch.getRootNode({
          depth: 0,
          entryFields: '*',
          entryLinkDepth,
          language: 'en-GB',
          versionStatus: deliveryApiStatus
        }, project);
      } else {
        // Handle preview routes
        if (isPreview) {
          let splitPath = currentPath.split('/');
          let entryGuid = splitPath[2];

          if (splitPath.length == 3) {
            // According to product dev we cannot use Node API
            // for previewing entries as it gives a response of []
            // -- apparently it is not correct to request latest content
            // with Node API
            let previewEntry = yield deliveryApi.getClient(deliveryApiStatus, project).entries.get({
              id: entryGuid,
              linkDepth: entryLinkDepth
            });

            if (previewEntry) {
              pathNode = {
                entry: previewEntry
              };
            }
          }
        } else {
          // Handle all other routes
          pathNode = yield cachedSearch.getNode({
            depth: doNavigation === true || doNavigation.children === true ? 3 : doNavigation && doNavigation.children || 0,
            path: currentPath,
            entryFields: setContentTypeLimits ? ['sys.contentTypeId', 'sys.id'] : '*',
            entryLinkDepth: setContentTypeLimits ? 0 : entryLinkDepth,
            versionStatus: deliveryApiStatus
          }, project);

          if (setContentTypeLimits && pathNode && pathNode.entry && pathNode.entry.sys && pathNode.entry.sys.id) {
            const contentType = ContentTypeMappings.find(ct => ct.contentTypeID === pathNode.entry.sys.contentTypeId);
            const query = routeEntryByFieldsQuery(pathNode.entry.sys.id, contentType && contentType.fields, deliveryApiStatus);
            const payload = yield cachedSearch.search(query, contentType && typeof contentType.linkDepth !== 'undefined' ? contentType.linkDepth : 3, project);

            if (payload && payload.items && payload.items.length > 0) {
              pathNode.entry = payload.items[0];
            }
          }
        }

        if (pathNode && pathNode.id) {
          if (doNavigation === true || doNavigation.ancestors) {
            try {
              ancestors = yield cachedSearch.getAncestors({
                id: pathNode.id,
                versionStatus: deliveryApiStatus
              }, project);
            } catch (ex) {
              log.info('Problem fetching ancestors', ex);
            }
          }

          if (doNavigation === true || doNavigation.siblings) {
            try {
              siblings = yield cachedSearch.getSiblings({
                id: pathNode.id,
                versionStatus: deliveryApiStatus
              }, project);
            } catch (ex) {
              log.info('Problem fetching siblings', ex);
            }
          }
        }
      }

      if (pathNode && pathNode.entry && pathNode.entry.sys && pathNode.entry.sys.id) {
        entry = pathNode.entry;
<<<<<<< HEAD:cjs/App-29c48e39.js
        const entryMapper = (ContentTypeMappings.find(ct => ct.contentTypeID === pathNode.entry.sys.contentTypeId) || {}).entryMapper;
        yield effects.all([effects.call(mapRouteEntry, { ...pathNode,
          ancestors,
          siblings
        }, entryMapper), effects.call(setRouteEntry, entry, pathNode, ancestors, siblings, false)]);
=======
        const {
          entryMapper
        } = ContentTypeMappings.find(ct => ct.contentTypeID === entry.sys.contentTypeId) || {};
        yield effects.call(setRouteEntry, entry, pathNode, ancestors, siblings, entryMapper);
>>>>>>> isomorphic-base:cjs/App-c6eeaa23.js
      } else {
        yield effects.call(do404);
      }

      if (!appsays || !appsays.preventScrollTop) {
        // Scroll into View
        if (typeof window !== 'undefined') {
          window.scroll({
            top: 0
          });
        }
      }
    }

    if (withEvents && withEvents.onRouteLoaded) {
      yield withEvents.onRouteLoaded({ ...action,
        entry
      });
    }

    if (!navigation.hasNavigationTree(state) && (doNavigation === true || doNavigation.tree)) if (typeof window !== 'undefined') {
      yield effects.put({
        type: navigation.GET_NODE_TREE,
        treeDepth: doNavigation === true || !doNavigation.tree || doNavigation.tree === true ? 0 : doNavigation.tree
      });
    } else {
      yield effects.call(ensureNodeTreeSaga);
    } // Load navigation clientside only, a put() should help that work
  } catch (e) {
    require$$7.error(...['Error running route saga:', e, e.stack]);
    yield effects.call(do404);
  }
}

<<<<<<< HEAD:cjs/App-29c48e39.js
function* setRouteEntry(entry, node, ancestors, siblings, notFound) {
  yield effects.all([// put({
  //   type: SET_NAVIGATION_NOT_FOUND,
  //   notFound: !(entry && entry.sys.id),
  // }),
  // put({
  //   type: SET_NODE,
  //   node,
  // }),
  effects.put({
    type: routing.SET_ENTRY,
    id: entry && entry.sys.id || null,
    entry,
    node,
    notFound
  }), // put({
  //   type: SET_ENTRY_ID,
  //   id: (entry && entry.sys.id) || null,
  // }),
  ancestors && effects.put({
    type: routing.SET_ANCESTORS,
=======
function* setRouteEntry(entry, node, ancestors, siblings, entryMapper, notFound = false) {
  const mappedEntry = yield mapRouteEntry(entryMapper, { ...node,
    entry,
    ancestors,
    siblings
  });
  yield effects.all([effects.put({
    type: selectors.SET_ENTRY,
    id: entry && entry.sys.id || null,
    entry,
    mappedEntry,
    node,
    notFound
  }), ancestors && effects.put({
    type: selectors.SET_ANCESTORS,
>>>>>>> isomorphic-base:cjs/App-c6eeaa23.js
    ancestors
  }), siblings && effects.put({
    type: routing.SET_SIBLINGS,
    siblings
  })]);
}

<<<<<<< HEAD:cjs/App-29c48e39.js
function* mapRouteEntry(node, entryMapper) {
  if (typeof entryMapper === 'function') {
    const mappedEntry = entryMapper(node);
    yield effects.put({
      type: routing.MAP_ENTRY,
      mappedEntry,
      node,
      entryMapper
    });
=======
function* mapRouteEntry(entryMapper, node) {
  try {
    if (typeof entryMapper === 'function') {
      const state = yield effects.select();
      const mappedEntry = yield effects.call(entryMapper, node, state);
      return mappedEntry;
    }
  } catch (e) {
    log.error(...['Error running entryMapper:', e, e.stack]);
>>>>>>> isomorphic-base:cjs/App-c6eeaa23.js
  }

  return;
}

function* do404() {
  // yield put({
  //   type: SET_NAVIGATION_NOT_FOUND,
  //   notFound: true,
  // });
  // yield put({
  //   type: SET_ENTRY_ID,
  //   id: null,
  // });
  yield effects.put({
    type: routing.SET_ENTRY,
    id: null,
    entry: null,
    notFound: true
  });
}

<<<<<<< HEAD:cjs/App-29c48e39.js
=======
const navigationSagas = [effects.takeEvery(navigation.GET_NODE_TREE, ensureNodeTreeSaga)];
function* ensureNodeTreeSaga(action) {
  const state = yield effects.select();

  try {
    if (!navigation.hasNavigationTree(state)) {
      const deliveryApiVersionStatus = yield effects.select(navigation.selectVersionStatus);
      const project = yield effects.select(selectors.selectCurrentProject);
      const nodes = yield deliveryApi.getClient(deliveryApiVersionStatus, project).nodes.getRoot({
        depth: action.treeDepth || 0
      });

      if (nodes) {
        yield effects.put({
          type: navigation.SET_NODE_TREE,
          nodes
        });
      } else {
        yield effects.put({
          type: navigation.GET_NODE_TREE_ERROR
        });
      }
    }
  } catch (ex) {
    yield effects.put({
      type: navigation.GET_NODE_TREE_ERROR,
      error: ex.toString()
    });
  }
}

>>>>>>> isomorphic-base:cjs/App-c6eeaa23.js
// index.js
function rootSaga (featureSagas = []) {
  return function* rootSaga() {
    const subSagas = [...routingSagas, ...navigationSagas];
    yield effects.all([...subSagas, ...featureSagas]);
  };
}

const AppRoot = props => {
  return React__default['default'].createElement(RouteLoader.RouteLoader, props);
};

exports.AppRoot = AppRoot;
exports.browserHistory = browserHistory;
exports.createStore = createStore;
exports.deliveryApi = deliveryApi;
exports.history = history;
exports.pickProject = pickProject;
exports.rootSaga = rootSaga;
<<<<<<< HEAD:cjs/App-29c48e39.js
//# sourceMappingURL=App-29c48e39.js.map
=======
//# sourceMappingURL=App-c6eeaa23.js.map
>>>>>>> isomorphic-base:cjs/App-c6eeaa23.js
