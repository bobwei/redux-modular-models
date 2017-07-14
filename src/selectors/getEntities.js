import R from 'ramda';
import { createSelector } from 'reselect';

const getEntities = ({ reducerName = 'models' } = {}) =>
  createSelector(R.path([reducerName]), R.map(R.path(['entities'])));

export default getEntities;
