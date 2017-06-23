import R from 'ramda';
import { handleActions } from 'redux-actions';

import createInitialState from './createInitialState';
import { arrayRemoveAll } from './actions';

const createReducer = ({ models }) => {
  const initialState = createInitialState(models);

  const reducer = handleActions(
    {
      [arrayRemoveAll]: (state, { meta: { model, arrayId } }) =>
        R.assocPath([model, 'arrays', arrayId], [], state),
    },
    initialState,
  );

  return reducer;
};

export default createReducer;
