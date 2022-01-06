import * as log from 'loglevel';
import { takeEvery, put, select, call, all } from 'redux-saga/effects';

import {
  SET_ENTRY,
  SET_ANCESTORS,
  SET_NAVIGATION_PATH,
  SET_ROUTE,
  SET_SIBLINGS,
  UPDATE_LOADING_STATE,
} from './types';
import { GET_NODE_TREE } from '~/redux/types/navigation';
import {
  selectCurrentAncestors,
  selectCurrentNode,
  selectCurrentProject,
  selectMappedEntry,
  selectRouteEntry,
  selectRouteEntryEntryId,
  selectRouteEntryLanguage,
} from './selectors';
import { hasNavigationTree } from '~/redux/selectors/navigation';
import { selectVersionStatus } from '~/redux/selectors/version';
import { ensureNodeTreeSaga } from '~/redux/sagas/navigation';
import { handleRequiresLoginSaga } from '~/user/redux/sagas/login';

import { findContentTypeMapping } from '../util/find-contenttype-mapping';
import { routeEntryByFieldsQuery } from '../util/queries';
import { cachedSearch, deliveryApi } from '~/util/ContensisDeliveryApi';
import { injectRedux as reduxInjector } from '~/redux/store/injectors';

export const routingSagas = [
  takeEvery(SET_NAVIGATION_PATH, getRouteSaga),
  takeEvery(SET_ROUTE, setRouteSaga),
];

/**
 * To navigate / push a specific route via redux middleware
 * @param {path, state} action
 */
function* setRouteSaga(action) {
  yield put({
    type: 'CALL_HISTORY_METHOD',
    payload: {
      method: 'push',
      args: [action.path, action.state],
    },
  });
}

function* getRouteSaga(action) {
  let entry = null;
  try {
    const {
      withEvents,
      routes: { ContentTypeMappings = {} } = {},
      staticRoute,
    } = action;

    // Inject redux { key, reducer, saga } provided by staticRoute
    if (staticRoute && staticRoute.route.injectRedux)
      yield call(reduxInjectorSaga, staticRoute.route.injectRedux);

    // Variables we will pass to setRouteEntry
    let pathNode = null,
      ancestors = null,
      siblings = null;

    // These variables are the return values from
    // calls to withEvents.onRouteLoad and onRouteLoaded
    let appsays,
      requireLogin = false;

    if (withEvents && withEvents.onRouteLoad) {
      appsays = yield withEvents.onRouteLoad(action);
    }
    // if appsays customNavigation: true, we will set doNavigation to false
    // if appsays customNavigation: { ... }, we will set doNavigation to the customNavigation object and check for child elements
    // if appsays nothing we will set doNavigation to true and continue to do navigation calls
    const doNavigation =
      !appsays ||
      (appsays && appsays.customNavigation === true
        ? false
        : (appsays && appsays.customNavigation) || true);

    const entryLinkDepth =
      appsays && appsays.entryLinkDepth !== undefined
        ? appsays.entryLinkDepth
        : 3;
    const setContentTypeLimits = !!ContentTypeMappings.find(
      ct => ct.fields || ct.linkDepth || ct.nodeOptions
    );

    const state = yield select();
    const routeEntry = selectRouteEntry(state, 'js');
    const routeNode = selectCurrentNode(state, 'js');
    const currentPath = action.path; //selectCurrentPath(state);
    const deliveryApiStatus = selectVersionStatus(state);
    const project = selectCurrentProject(state);
    // const isHome = currentPath === '/';
    const isPreview = currentPath && currentPath.startsWith('/preview/');
    const defaultLang = (appsays && appsays.defaultLang) || 'en-GB';

    if (
      !isPreview &&
      ((appsays && appsays.customRouting) ||
        (staticRoute && !staticRoute.route.fetchNode) ||
        (routeEntry &&
          action.statePath === action.path &&
          (appsays && appsays.refetchNode) !== true))
    ) {
      // To prevent erroneous 404s and wasted network calls, this covers
      // - appsays customRouting and does SET_ENTRY etc. via the consuming app
      // - all staticRoutes (where custom 'route.fetchNode' attribute is falsey)
      // - standard Contensis SiteView Routing where we already have that entry in state
      if (
        routeEntry &&
        (!staticRoute || (staticRoute.route && staticRoute.route.fetchNode))
      ) {
        pathNode = { ...routeNode, entry: null };
        pathNode.entry = entry = routeEntry;
        //Do nothing, the entry is allready the right one.
        // yield put({
        //   type: SET_ENTRY,
        //   entry,
        //   node: routeNode,
        //   isLoading: false,
        // });
        yield put({
          type: UPDATE_LOADING_STATE,
          isLoading: false,
        });
      } else
        yield call(
          setRouteEntry,
          routeEntry,
          yield select(selectCurrentNode),
          yield select(selectCurrentAncestors)
        );
    } else {
      // // Handle homepage
      // if (isHome) {
      //   pathNode = yield cachedSearch.getRootNode(
      //     {
      //       depth: childrenDepth,
      //       entryFields: '*',
      //       entryLinkDepth,
      //       language: defaultLang,
      //       versionStatus: deliveryApiStatus,
      //     },
      //     project
      //   );
      //   ({ entry } = pathNode || {});
      // Handle preview routes
      if (isPreview) {
        let splitPath = currentPath.split('/');
        let entryGuid = splitPath[2];
        let language = defaultLang;
        if (splitPath.length >= 3) {
          //set lang key if available in the path, else use default lang
          //assumes preview url on content type is: http://preview.ALIAS.contensis.cloud/preview/{GUID}/{LANG}
          if (splitPath.length == 4) language = splitPath[3];
          // According to product dev we cannot use Node API
          // for previewing entries as it gives a response of []
          // -- apparently it is not correct to request latest content
          // with Node API

          let previewEntry = yield deliveryApi
            .getClient(deliveryApiStatus, project)
            .entries.get({
              id: entryGuid,
              language,
              linkDepth: entryLinkDepth,
            });
          if (previewEntry) {
            pathNode = { entry: previewEntry };
            ({ entry } = pathNode || {});
          }
        }
      } else {
        // Handle all other routes
        const childrenDepth =
          doNavigation === true || doNavigation.children === true
            ? 1
            : (doNavigation && doNavigation.children) || 0;

        pathNode = yield cachedSearch.getNode(
          {
            depth: childrenDepth,
            path: currentPath,
            entryFields: setContentTypeLimits
              ? ['sys.contentTypeId', 'sys.id']
              : '*',
            entryLinkDepth: setContentTypeLimits ? 0 : entryLinkDepth,
            language: defaultLang,
            versionStatus: deliveryApiStatus,
          },
          project
        );
        ({ entry } = pathNode || {});

        if (
          setContentTypeLimits &&
          pathNode &&
          pathNode.entry &&
          pathNode.entry.sys &&
          pathNode.entry.sys.id
        ) {
          // Get fields[] and linkDepth from ContentTypeMapping to get the entry data
          // at a specified depth with specified fields
          const {
            fields,
            linkDepth,
            nodeOptions = {},
          } = findContentTypeMapping(
            ContentTypeMappings,
            pathNode.entry.sys.contentTypeId
          ) || {};
          const query = routeEntryByFieldsQuery(
            pathNode.entry.sys.id,
            pathNode.entry.sys.language,
            fields,
            deliveryApiStatus
          );
          const payload = yield cachedSearch.search(
            query,
            linkDepth || entryLinkDepth || 0,
            project
          );
          if (payload && payload.items && payload.items.length > 0) {
            pathNode.entry = entry = payload.items[0];
          }

          if (childrenDepth > 0 || nodeOptions.children) {
            const childrenOptions = nodeOptions.children || {};
            // We need to make a separate call for child nodes if the first node query has been
            // limited by linkDepth or fields[]
            const nodeWithChildren = yield cachedSearch.getNode({
              depth:
                childrenOptions.depth !== undefined
                  ? childrenOptions.depth
                  : childrenDepth,
              path: currentPath,
              entryFields: childrenOptions.fields || fields || '*',
              entryLinkDepth:
                childrenOptions.linkDepth !== undefined
                  ? childrenOptions.linkDepth
                  : linkDepth !== undefined
                  ? linkDepth
                  : entryLinkDepth,
              language: defaultLang,
              versionStatus: deliveryApiStatus,
            });
            if (nodeWithChildren && nodeWithChildren.children) {
              pathNode.children = nodeWithChildren.children;
            }
          }
        }
      }

      if (pathNode && pathNode.id) {
        if (doNavigation === true || doNavigation.ancestors) {
          try {
            ancestors = yield cachedSearch.getAncestors(
              {
                id: pathNode.id,
                language: defaultLang,
                versionStatus: deliveryApiStatus,
              },
              project
            );
          } catch (ex) {
            log.info('Problem fetching ancestors', ex);
          }
        }

        if (doNavigation === true || doNavigation.siblings) {
          try {
            siblings = yield cachedSearch.getSiblings(
              {
                id: pathNode.id,
                language: defaultLang,
                versionStatus: deliveryApiStatus,
              },
              project
            );
          } catch (ex) {
            log.info('Problem fetching siblings', ex);
          }
        }
      }
    }

    const contentTypeMapping =
      findContentTypeMapping(
        ContentTypeMappings,
        pathNode?.entry?.sys?.contentTypeId
      ) || {};

    // Inject redux { key, reducer, saga } provided by ContentTypeMapping
    if (contentTypeMapping.injectRedux)
      yield call(reduxInjectorSaga, contentTypeMapping.injectRedux);

    if (withEvents && withEvents.onRouteLoaded) {
      // Check if the app has provided a requireLogin boolean flag or groups array
      // in addition to checking if requireLogin is set in the route definition
      ({ requireLogin } =
        (yield withEvents.onRouteLoaded({ ...action, entry })) || {});
    }

    if (requireLogin !== false) {
      // Do not call the login feature saga if requireLogin is false
      yield call(handleRequiresLoginSaga, {
        ...action,
        entry,
        requireLogin,
      });
    }

    if (
      pathNode &&
      pathNode.entry &&
      pathNode.entry.sys &&
      pathNode.entry.sys.id
    ) {
      entry = pathNode.entry;
      const { entryMapper } = contentTypeMapping;

      yield call(
        setRouteEntry,
        entry,
        pathNode,
        ancestors,
        siblings,
        entryMapper,
        false,
        appsays && appsays.refetchNode
      );
    } else {
      if (staticRoute)
        yield call(setRouteEntry, null, pathNode, ancestors, siblings);
      else yield call(do404);
    }
    if (!appsays || !appsays.preventScrollTop) {
      // Scroll into View
      if (typeof window !== 'undefined') {
        window.scroll({
          top: 0,
        });
      }
    }

    if (
      !hasNavigationTree(state) &&
      (doNavigation === true || doNavigation.tree)
    )
      if (typeof window !== 'undefined') {
        yield put({
          type: GET_NODE_TREE,
          treeDepth:
            doNavigation === true ||
            !doNavigation.tree ||
            doNavigation.tree === true
              ? 2
              : doNavigation.tree,
        });
      } else {
        yield call(ensureNodeTreeSaga);
      }
  } catch (e) {
    log.error(...['Error running route saga:', e, e.stack]);
    yield call(do500, e);
  }
}

function* setRouteEntry(
  entry,
  node,
  ancestors,
  siblings,
  entryMapper,
  notFound = false,
  remapEntry = false
) {
  const entrySys = (entry && entry.sys) || {};

  const currentEntryId = yield select(selectRouteEntryEntryId);
  const currentEntryLang = yield select(selectRouteEntryLanguage);
  const mappedEntry =
    currentEntryId === entrySys.id &&
    currentEntryLang === entrySys.language &&
    remapEntry === false
      ? (yield select(selectMappedEntry, 'js')) || {}
      : yield mapRouteEntry(entryMapper, {
          ...node,
          entry,
          ancestors,
          siblings,
        });

  yield all([
    put({
      type: SET_ENTRY,
      id: entrySys.id,
      entry,
      mappedEntry,
      node,
      notFound,
    }),
    ancestors &&
      put({
        type: SET_ANCESTORS,
        ancestors,
      }),
    siblings &&
      put({
        type: SET_SIBLINGS,
        siblings,
      }),
  ]);
}

function* mapRouteEntry(entryMapper, node) {
  try {
    if (typeof entryMapper === 'function') {
      const state = yield select();
      const mappedEntry = yield call(entryMapper, node, state);
      return mappedEntry;
    }
  } catch (e) {
    log.error(...['Error running entryMapper:', e, e.stack]);
  }
  return;
}

function* do404() {
  yield call(clientReloadHitServer);
  yield put({
    type: SET_ENTRY,
    id: null,
    entry: null,
    notFound: true,
  });
}

function* clientReloadHitServer() {
  const stateEntry = yield select(selectRouteEntry);

  // If in client and there is a stateEntry.sys field reload the page,
  // on the 2nd load stateEntry.sys should be null at this point,
  // we do not wish to reload again and get stuck in an infinite reloading loop
  if (typeof window !== 'undefined' && (stateEntry?.sys || null)) {
    window.location.reload();
  }
}

function* do500(error) {
  yield put({
    type: SET_ENTRY,
    id: null,
    entry: null,
    notFound: true,
    isError: true,
    error,
    statusCode: error && error.status ? error.status : 500,
  });
}

function* reduxInjectorSaga(injectorFn) {
  if (typeof injectorFn === 'function') {
    const { key, reducer, saga } = yield injectorFn();
    reduxInjector({ key, reducer, saga });
  }
}
