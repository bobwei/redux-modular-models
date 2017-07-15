import R from 'ramda';

import REDUCER_KEY from '../constants/REDUCER_KEY';

const getSchema = (model, schemaId, { reducerKey = REDUCER_KEY } = {}) =>
  R.path([reducerKey, model, 'schemas', schemaId]);

export default getSchema;
