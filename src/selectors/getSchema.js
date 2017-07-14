import R from 'ramda';

import REDUCER_NAME from '../constants/REDUCER_NAME';

const getSchema = (model, schemaId, { reducerName = REDUCER_NAME } = {}) =>
  R.path([reducerName, model, 'schemas', schemaId]);

export default getSchema;
