import R from 'ramda';
import { createSelector } from 'reselect';

import REDUCER_KEY from '../constants/REDUCER_KEY';

const getEntities = ({ reducerKey = REDUCER_KEY } = {}) =>
  R.compose(
    R.defaultTo({}),
    createSelector(
      R.pathOr({}, [reducerKey]),
      R.map(R.pathOr({}, ['entities'])),
    ),
  );

export default getEntities;
