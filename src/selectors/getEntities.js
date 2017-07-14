import R from 'ramda';
import { createSelector } from 'reselect';

import REDUCER_NAME from '../constants/REDUCER_NAME';

const getEntities = ({ reducerName = REDUCER_NAME } = {}) =>
  createSelector(R.path([reducerName]), R.map(R.path(['entities'])));

export default getEntities;
