import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Action,
  Store,
  StoreEnhancer,
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createSagaMiddleware, { END } from 'redux-saga';
import { createInjectorsEnhancer } from 'redux-injectors';

// Core reducers
import NavigationReducer from '../reducers/navigation';
import RoutingReducer from '~/routing/redux/reducers';
import UserReducer from '~/user/redux/reducers';
import VersionReducer from '../reducers/version';
import routerMiddleware from './routerMiddleware';
import { AppState } from '../appstate';
import { History, MemoryHistory } from 'history';
import { StateType } from '~/config';

/* eslint-disable no-underscore-dangle */
declare let window: Window &
  typeof globalThis & {
    __REDUX_DEVTOOLS_EXTENSION__: any;
  };

type ReduxAppStore = Store<AppState, Action<any>>;

type ReduxSagaAppStore = ReduxAppStore & {
  runSaga: ReturnType<typeof createSagaMiddleware>['run'];
  close: () => void;
};

export let reduxStore: ReduxSagaAppStore;

export default async (
  featureReducers: any,
  initialState: AppState,
  history: History | MemoryHistory,
  stateType: StateType
) => {
  let reduxDevToolsMiddleware = f => f;

  if (typeof window != 'undefined') {
    reduxDevToolsMiddleware = window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f;
  }

  const sagaMiddleware = createSagaMiddleware();

  const reducers = {
    navigation: NavigationReducer,
    routing: RoutingReducer,
    user: UserReducer,
    version: VersionReducer,
    ...featureReducers,
  };

  // Reassign the combiner and fromJS functions when
  // stateType is 'immutable' with dynamic imports
  let combiner = combineReducers;
  let fromJS = <T = any>(obj: T) => obj;
  globalThis.STATE_TYPE = stateType;

  if (stateType === 'immutable') {
    globalThis.immutable = await import(
      /* webpackChunkName: "immutable" */ 'immutable'
    );

    fromJS = (
      await import(/* webpackChunkName: "from-js" */ '~/util/fromJSLeaveImmer')
    ).default;

    combiner = (
      await import(/* webpackChunkName: "redux-immutable" */ 'redux-immutable')
    ).combineReducers;
  }

  const createReducer = (injectedReducers = {}) => {
    const rootReducer = combiner<AppState>({
      ...injectedReducers,
      // other non-injected reducers go here
      ...reducers,
    });

    return rootReducer;
  };

  const store = (initialState: AppState) => {
    const runSaga = sagaMiddleware.run;

    const middleware: StoreEnhancer<{
      runSaga: ReturnType<typeof createSagaMiddleware>['run'];
      close: () => void;
    }> = compose(
      applyMiddleware(
        thunkMiddleware,
        sagaMiddleware,
        routerMiddleware(history)
      ),
      createInjectorsEnhancer({
        createReducer,
        runSaga,
      }),
      reduxDevToolsMiddleware
    );

    const store = createStore(createReducer(), initialState, middleware);

    store.runSaga = runSaga;
    store.close = () => store.dispatch(END);
    return store;
  };

  reduxStore = store(fromJS(initialState));
  return reduxStore;
};
