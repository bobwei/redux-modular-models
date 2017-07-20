import R from 'ramda';
import { createSelector, defaultMemoize } from 'reselect';
import { denormalize } from 'normalizr';

import REDUCER_KEY from '../constants/REDUCER_KEY';
import getEntities from './getEntities';
import getSchema from './getSchema';

const getObject = (model, objectId, state, { reducerKey = REDUCER_KEY } = {}) =>
  R.compose(
    R.defaultTo({}),
    createSelector(
      getSchema(model, 'entity', { reducerKey }),
      getEntities({ reducerKey }),
      R.partial(denormalize, [objectId]),
    ),
  )(state);

export default R.compose(R.curryN(3), defaultMemoize)(getObject);
