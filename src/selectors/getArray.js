import R from 'ramda';
import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';

import REDUCER_NAME from '../constants/REDUCER_NAME';
import getEntities from './getEntities';
import getSchema from './getSchema';

const getArray = (model, arrayId, { reducerName = REDUCER_NAME } = {}) =>
  createSelector(
    R.path([reducerName, model, 'arrays', arrayId]),
    getSchema(model, 'array'),
    getEntities({ reducerName }),
    denormalize,
  );

export default getArray;
