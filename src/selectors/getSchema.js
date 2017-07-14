import R from 'ramda';

const getSchema = (model, schemaId, { reducerName = 'models' } = {}) =>
  R.path([reducerName, model, 'schemas', schemaId]);

export default getSchema;
