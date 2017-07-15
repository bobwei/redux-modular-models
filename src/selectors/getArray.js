import R from 'ramda';
import { createSelector } from 'reselect';
import { denormalize } from 'normalizr';

import REDUCER_KEY from '../constants/REDUCER_KEY';
import getEntities from './getEntities';
import getSchema from './getSchema';

const getArray = (model, arrayId, { reducerKey = REDUCER_KEY } = {}) =>
  createSelector(
    R.path([reducerKey, model, 'arrays', arrayId]),
    getSchema(model, 'array'),
    getEntities({ reducerKey }),
    denormalize,
  );

export default getArray;
