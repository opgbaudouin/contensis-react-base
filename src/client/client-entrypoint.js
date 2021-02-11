import ClientApp from '%/client/client'; // the entry point for the rest of the app
import ReactApp from '%/App';
// import ClientApp, { ReactApp } from '../../client';

import routes from '~/routes';
import withReducers from '~/redux/reducers';
import withSagas from '~/redux/sagas';
import withEvents from '~/redux/withEvents';

const config = {
  routes,
  withReducers,
  withSagas,
  withEvents,
};

new ClientApp(ReactApp, config);
