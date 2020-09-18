import React from 'react';
import { Map, List, fromJS, Set as Set$1 } from 'immutable';
import { createBrowserHistory, createMemoryHistory } from 'history';
import { Client, Op, Query } from 'contensis-delivery-api';
import { S as SET_TARGET_PROJECT, f as SET_SIBLINGS, g as SET_ROUTE, h as SET_NAVIGATION_PATH, i as SET_ENTRY, j as SET_ANCESTORS, M as MAP_ENTRY, C as CALL_HISTORY_METHOD, d as selectRouteEntry, k as selectCurrentPath, e as selectCurrentProject } from './routing-79ebf51a.js';
import { S as SET_VERSION, b as SET_VERSION_STATUS, G as GET_NODE_TREE_ERROR, c as SET_NODE_TREE, d as selectVersionStatus, h as hasNavigationTree, e as GET_NODE_TREE } from './navigation-4a24199a.js';
import { compose, applyMiddleware, createStore as createStore$1 } from 'redux';
import { combineReducers } from 'redux-immutable';
import thunk from 'redux-thunk';
import createSagaMiddleware, { END } from 'redux-saga';
import { takeEvery, put, select, call, all } from 'redux-saga/effects';
import { error } from 'loglevel';
import 'react-hot-loader';
import { R as RouteLoader } from './RouteLoader-952df30e.js';

const selectedHistory = typeof window !== 'undefined' ? createBrowserHistory : createMemoryHistory;
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

const getClientConfig = project => {
  let config = DELIVERY_API_CONFIG;
  /* global DELIVERY_API_CONFIG */

  if (project) {
    config.projectId = project;
  }

  if (typeof window != 'undefined' && PROXY_DELIVERY_API
  /* global PROXY_DELIVERY_API */
  ) {
      // ensure a relative url is used to bypass the need for CORS (separate OPTIONS calls)
      config.rootUrl = '';
      config.responseHandler = {
        404: () => null
      };
    }

  return config;
};

const GetClientSideDeliveryApiStatus = () => {
  if (typeof window != 'undefined') {
    const currentHostname = window.location.hostname;
    return GetDeliveryApiStatusFromHostname(currentHostname);
  }

  return null;
};
const GetDeliveryApiStatusFromHostname = currentHostname => {
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
const GetResponseGuids = object => {
  let Ids = [];
  Object.keys(object).some(function (k) {
    if (k === 'sys') {
      //Should always have an ID, but lets check...
      if (object[k].id && object[k].language) {
        // We can exclude assets here i think... ?
        if (object[k].dataFormat) {
          if (object[k].dataFormat !== 'asset') {
            Ids.push(`${object[k].id}_${object[k].language.toLowerCase()}`);
          }
        } else {
          // If we don't have a dataformat add it anyhow, for safety
          Ids.push(`${object[k].id}_${object[k].language.toLowerCase()}`);
        }
      }

      return false;
    }

    if (object[k] && typeof object[k] === 'object') {
      let subIds = GetResponseGuids(object[k]);

      if (subIds.length > 0) {
        Ids.push(...subIds);
      }

      return false;
    }
  });
  return Ids;
};
const GetAllResponseGuids = object => {
  if (!object) return [];
  let returnItems = GetResponseGuids(object);
  let unique = new Set(returnItems);
  return unique;
};

class DeliveryApi {
  search(query, linkDepth, project, env) {
    const client = Client.create(getClientConfig(project));
    return client.entries.search(query, typeof linkDepth !== 'undefined' ? linkDepth : 1);
  }

  getClient(deliveryApiStatus = 'published', project, env) {
    const baseConfig = getClientConfig(project);
    baseConfig.versionStatus = deliveryApiStatus;
    return Client.create(baseConfig);
  }

  getEntry(id, linkDepth = 0, deliveryApiStatus = 'published', project, env) {
    const baseConfig = getClientConfig(project);
    baseConfig.versionStatus = deliveryApiStatus;
    const client = Client.create(baseConfig); // return client.entries.get(id, linkDepth);

    return client.entries.get({
      id,
      linkDepth
    });
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
    const client = Client.create(getClientConfig(project));
    return this.request(project + JSON.stringify(query) + linkDepth.toString(), () => client.entries.search(query, linkDepth));
  }

  get(id, linkDepth, versionStatus, project, env) {
    const client = Client.create(getClientConfig(project));
    client.clientConfig.versionStatus = versionStatus;
    return this.request(id, () => client.entries.get({
      id,
      linkDepth
    }));
  }

  getContentType(id, project, env) {
    const client = Client.create(getClientConfig(project));
    return this.request(`[CONTENT TYPE] ${id} ${project}`, () => client.contentTypes.get(id));
  }

  getTaxonomyNode(key, project, env) {
    const client = Client.create(getClientConfig(project));
    return this.request(`[TAXONOMY NODE] ${key}`, () => client.taxonomy.resolveChildren(key).then(node => this.extendTaxonomyNode(node)));
  }

  getRootNode(options, project, env) {
    const client = Client.create(getClientConfig(project));
    return this.request(`${project} / ${JSON.stringify(options)}`, () => client.nodes.getRoot(options));
  }

  getNode(options, project, env) {
    const client = Client.create(getClientConfig(project));
    return this.request(`${project} ${options && options.path || options} ${JSON.stringify(options)}`, () => client.nodes.get(options));
  }

  getAncestors(options, project, env) {
    const client = Client.create(getClientConfig(project));
    return this.request(`${project} [A] ${options && options.id || options} ${JSON.stringify(options)}`, () => client.nodes.getAncestors(options));
  }

  getChildren(options, project, env) {
    const client = Client.create(getClientConfig(project));
    return this.request(`${project} [C] ${options && options.id || options} ${JSON.stringify(options)}`, () => client.nodes.getChildren(options));
  }

  getSiblings(options, project, env) {
    const client = Client.create(getClientConfig(project));
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

let initialState = Map({
  currentPath: '/',
  currentNode: [],
  currentProject: 'unknown',
  notFound: false,
  entryID: null,
  entry: null,
  entryDepends: new List(),
  contentTypeId: null,
  currentNodeAncestors: new List(),
  currentTreeId: null
});
var RoutingReducer = ((state = initialState, action) => {
  switch (action.type) {
    case MAP_ENTRY:
      {
        return state.set('mappedEntry', fromJS(action.mappedEntry));
      }

    case SET_ANCESTORS:
      {
        if (action.ancestors) {
          let ancestorIDs = action.ancestors.map(node => {
            return node.id;
          });
          let currentNodeDepends = state.get('nodeDepends');
          const allNodeDepends = Set$1.union([Set$1(ancestorIDs), currentNodeDepends]);
          return state.set('nodeDepends', allNodeDepends).set('currentNodeAncestors', fromJS(action.ancestors));
        }

        return state.set('currentNodeAncestors', fromJS(action.ancestors));
      }

    case SET_ENTRY:
      {
        const {
          entry,
          node = {},
          isLoading = false
        } = action;
        let nextState;

        if (!entry) {
          nextState = state.set('entryID', null).set('entryDepends', null).set('entry', null).set('mappedEntry', null).set('isLoading', isLoading);
        } else {
          const entryDepends = GetAllResponseGuids(entry);
          nextState = state.set('entryID', action.id).set('entryDepends', fromJS(entryDepends)).set('entry', fromJS(entry)).set('isLoading', isLoading);
        }

        if (!node) {
          return nextState.set('nodeDepends', null).set('currentNode', null);
        } else {
          // On Set Node, we reset all dependants.
          const nodeDepends = Set$1([node.id]);
          return nextState.set('nodeDepends', nodeDepends).set('currentNode', fromJS(node)).removeIn(['currentNode', 'entry']); // We have the entry stored elsewhere, so lets not keep it twice.
        }
      }
    // case SET_ENTRY_ID: {
    //   if (action.id === '') {
    //     return state;
    //   }
    //   return state.set('entryID', action.id);
    // }

    case SET_NAVIGATION_PATH:
      {
        let staticRoute = false;

        if (action.staticRoute) {
          staticRoute = { ...action.staticRoute
          };
        }

        if (action.path) {
          return state.set('currentPath', fromJS(action.path)).set('location', fromJS(action.location)).set('staticRoute', fromJS({ ...staticRoute,
            route: { ...staticRoute.route,
              component: null
            }
          })).set('isLoading', typeof window !== 'undefined');
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

    case SET_ROUTE:
      {
        return state.set('nextPath', action.path);
      }

    case SET_SIBLINGS:
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
        const allNodeDepends = Set$1.union([Set$1(siblingIDs), currentNodeDepends]);
        return state.set('nodeDepends', allNodeDepends).set('currentNodeSiblings', fromJS(action.siblings)).set('currentNodeSiblingsParent', currentNodeSiblingParent);
      }

    case SET_TARGET_PROJECT:
      {
        return state.set('currentProject', action.project).set('currentTreeId', '') //getTreeID(action.project))
        .set('allowedGroups', fromJS(action.allowedGroups));
      }

    default:
      return state;
  }
});

let initialState$1 = Map({
  commitRef: null,
  buildNo: null,
  contensisVersionStatus: 'published'
});
var VersionReducer = ((state = initialState$1, action) => {
  switch (action.type) {
    case SET_VERSION_STATUS:
      {
        return state.set('contensisVersionStatus', action.status);
      }

    case SET_VERSION:
      {
        return state.set('commitRef', action.commitRef).set('buildNo', action.buildNo);
      }

    default:
      return state;
  }
});

const initialState$2 = Map({
  root: null,
  treeDepends: new List([]),
  isError: false,
  isReady: false
});
var NavigationReducer = ((state = initialState$2, action) => {
  switch (action.type) {
    case SET_NODE_TREE:
      {
        return state.set('root', fromJS(action.nodes)).set('isReady', true);
      }

    case GET_NODE_TREE_ERROR:
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
  if (action.type !== CALL_HISTORY_METHOD) {
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
  const thunkMiddleware = [thunk];

  let reduxDevToolsMiddleware = f => f;

  if (typeof window != 'undefined') {
    reduxDevToolsMiddleware = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f;
  }

  const sagaMiddleware = createSagaMiddleware();
  const middleware = compose(applyMiddleware(...thunkMiddleware, sagaMiddleware, routerMiddleware(history)), reduxDevToolsMiddleware);
  let reducers = {
    navigation: NavigationReducer,
    routing: RoutingReducer,
    version: VersionReducer,
    ...featureReducers
  };
  const combinedReducers = combineReducers(reducers);

  const store = initialState => {
    const store = createStore$1(combinedReducers, initialState, middleware);
    store.runSaga = sagaMiddleware.run;

    store.close = () => store.dispatch(END);

    return store;
  };

  return store(initialState);
});

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
  if (Array.isArray(value)) return equalToOrIn(field, value, operator);else return !weight ? [Op[operator](field, value)] : [Op[operator](field, value).weight(weight)];
};
const defaultExpressions = versionStatus => {
  return [Op.equalTo(Fields.sys.versionStatus, versionStatus)];
};

const equalToOrIn = (field, arr, operator = 'equalTo') => arr.length === 0 ? [] : arr.length === 1 ? [Op[operator](field, arr[0])] : [Op.in(field, ...arr)];

// eslint-disable-next-line import/named
const routeEntryByFieldsQuery = (id, fields = [], versionStatus = 'published') => {
  const query = new Query(...[...fieldExpression('sys.id', id), ...defaultExpressions(versionStatus)]);
  query.fields = fields;
  return query;
};

// load-entries.js
const routingSagas = [takeEvery(SET_NAVIGATION_PATH, getRouteSaga), takeEvery(SET_ROUTE, setRouteSaga)];
/**
 * To navigate / push a specific route via redux middleware
 * @param {path, state} action
 */

function* setRouteSaga(action) {
  yield put({
    type: CALL_HISTORY_METHOD,
    payload: {
      method: 'push',
      args: [action.path, action.state]
    }
  });
}

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
    const state = yield select();
    const routeEntry = selectRouteEntry(state);
    const currentPath = selectCurrentPath(state);
    const deliveryApiStatus = selectVersionStatus(state);
    const project = selectCurrentProject(state);
    const isHome = currentPath === '/';
    const isPreview = currentPath && currentPath.startsWith('/preview/');

    if (!isPreview && (appsays && appsays.customRouting || staticRoute && !staticRoute.route.fetchNode || routeEntry && action.statePath === action.path)) {
      // To prevent erroneous 404s and wasted network calls, this covers
      // - appsays customRouting and does SET_ENTRY etc. via the consuming app
      // - all staticRoutes (where custom 'route.fetchNode' attribute is falsey)
      // - standard Contensis SiteView Routing where we already have that entry in state
      if (routeEntry && (!staticRoute || staticRoute.route && staticRoute.route.fetchNode)) {
        entry = routeEntry.toJS();
        yield put({
          type: SET_ENTRY,
          entry,
          isLoading: false
        });
      } else yield call(setRouteEntry);
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
              linkDepth: 3
            });

            if (previewEntry) {
              pathNode = {
                entry: previewEntry
              }; // yield call(setRouteEntry, previewEntry);
              // } else {
              // yield call(do404);
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

        if (pathNode && pathNode.id && (doNavigation === true || doNavigation.ancestors)) {
          ancestors = yield cachedSearch.getAncestors(pathNode.id, project);

          if (doNavigation === true || doNavigation.siblings) {
            siblings = yield cachedSearch.getSiblings({
              id: pathNode.id,
              entryFields: ['sys.contentTypeId', 'url']
            }, project);
          }
        }
      }

      if (pathNode && pathNode.entry && pathNode.entry.sys && pathNode.entry.sys.id) {
        entry = pathNode.entry;
        const entryMapper = (ContentTypeMappings.find(ct => ct.contentTypeID === pathNode.entry.sys.contentTypeId) || {}).entryMapper;
        yield all([call(mapRouteEntry, { ...pathNode,
          ancestors,
          siblings
        }, entryMapper), call(setRouteEntry, entry, pathNode, ancestors, siblings)]);
      } else {
        yield call(do404);
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

    if (!hasNavigationTree(state) && (doNavigation === true || doNavigation.tree)) // Load navigation clientside only, a put() should help that work
      yield put({
        type: GET_NODE_TREE,
        treeDepth: doNavigation === true || !doNavigation.tree || doNavigation.tree === true ? 2 : doNavigation.tree
      });
  } catch (e) {
    error(...['Error running route saga:', e, e.stack]);
    yield call(do404);
  }
}

function* setRouteEntry(entry, node, ancestors, siblings) {
  yield all([// put({
  //   type: SET_NAVIGATION_NOT_FOUND,
  //   notFound: !(entry && entry.sys.id),
  // }),
  // put({
  //   type: SET_NODE,
  //   node,
  // }),
  put({
    type: SET_ENTRY,
    id: entry && entry.sys.id || null,
    entry,
    node
  }), // put({
  //   type: SET_ENTRY_ID,
  //   id: (entry && entry.sys.id) || null,
  // }),
  ancestors && put({
    type: SET_ANCESTORS,
    ancestors
  }), siblings && put({
    type: SET_SIBLINGS,
    siblings
  })]);
}

function* mapRouteEntry(node, entryMapper) {
  if (typeof entryMapper === 'function') {
    const mappedEntry = entryMapper(node);
    yield put({
      type: MAP_ENTRY,
      mappedEntry,
      node,
      entryMapper
    });
  }
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
  yield put({
    type: SET_ENTRY,
    id: null,
    entry: null,
    notFound: true
  });
}

const navigationSagas = [takeEvery(GET_NODE_TREE, ensureNodeTreeSaga)];
function* ensureNodeTreeSaga(action) {
  const state = yield select();

  try {
    if (!hasNavigationTree(state)) {
      const deliveryApiVersionStatus = yield select(selectVersionStatus);
      const project = yield select(selectCurrentProject);
      const nodes = yield deliveryApi.getClient(deliveryApiVersionStatus, project).nodes.getRoot({
        depth: action.treeDepth || 2,
        entryFields: 'entryTitle, metaInformation, sys.contentTypeId'
      });

      if (nodes) {
        yield put({
          type: SET_NODE_TREE,
          nodes
        });
      } else {
        yield put({
          type: GET_NODE_TREE_ERROR
        });
      }
    }
  } catch (ex) {
    yield put({
      type: GET_NODE_TREE_ERROR,
      error: ex.toString()
    });
  }
}

// index.js
function rootSaga (featureSagas = []) {
  return function* rootSaga() {
    const subSagas = [...routingSagas, ...navigationSagas];
    yield all([...subSagas, ...featureSagas]);
  };
}

const AppRoot = props => {
  return React.createElement(RouteLoader, props);
};

export { AppRoot as A, GetDeliveryApiStatusFromHostname as G, GetClientSideDeliveryApiStatus as a, browserHistory as b, createStore as c, history as h, pickProject as p, rootSaga as r };
//# sourceMappingURL=App-917f63e1.js.map