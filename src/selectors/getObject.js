import R from 'ramda';
import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';

import getEntities from './getEntities';
import getSchema from './getSchema';

const getObject = (model, objectId, { reducerName = 'models' } = {}) =>
  createSelector(
    getSchema(model, 'entity', { reducerName }),
    getEntities({ reducerName }),
    R.partial(denormalize, [objectId]),
  );

export default getObject;
