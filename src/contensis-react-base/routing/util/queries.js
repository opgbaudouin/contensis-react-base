// eslint-disable-next-line import/named
import { Query } from '%/util/ContensisDeliveryApi';
import { fieldExpression, defaultExpressions } from './search/expressions';

export const routeEntryByFieldsQuery = (
  id,
  fields = [],
  versionStatus = 'published'
) => {
  const query = new Query(
    ...[...fieldExpression('sys.id', id), ...defaultExpressions(versionStatus)]
  );
  query.fields = fields;
  return query;
};
