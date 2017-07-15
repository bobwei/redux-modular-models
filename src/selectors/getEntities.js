import R from 'ramda';
import { createSelector } from 'reselect';

import REDUCER_KEY from '../constants/REDUCER_KEY';

const getEntities = ({ reducerKey = REDUCER_KEY } = {}) =>
  createSelector(R.path([reducerKey]), R.map(R.path(['entities'])));

export default getEntities;
