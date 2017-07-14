import R from 'ramda';
import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';

import REDUCER_NAME from '../constants/REDUCER_NAME';
import getEntities from './getEntities';
import getSchema from './getSchema';

const getObject = (model, objectId, { reducerName = REDUCER_NAME } = {}) =>
  createSelector(
    getSchema(model, 'entity', { reducerName }),
    getEntities({ reducerName }),
    R.partial(denormalize, [objectId]),
  );

export default getObject;
