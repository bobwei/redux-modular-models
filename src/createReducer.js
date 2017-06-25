// @flow
import R from 'ramda';
import { handleActions } from 'redux-actions';
import { normalize } from 'normalizr';

import createInitialState from './createInitialState';
import { arrayRemoveAll, arrayConcat } from './actions';

type Options = {
  models: Array<{
    name: string,
    initialState: any,
    schema: any,
  }>,
};

const createReducer = ({ models }: Options) => {
  const initialState = createInitialState(models);
  const indexedModels = R.indexBy(R.prop('name'))(models);

  const reducer = handleActions(
    {
      [arrayRemoveAll]: (state, { meta: { model, arrayId } }) =>
        R.assocPath([model, 'arrays', arrayId], [], state),
      [arrayConcat]: (state, { payload, meta: { model, arrayId } }) => {
        /* array of schema */
        const schema = R.compose(R.of, R.path([model, 'schema']))(
          indexedModels,
        );
        const normalizedData = normalize(payload, schema);
        const result = R.compose(
          /* for each entity in normalizedData.entities, merge to model.entities */
          R.apply(
            R.compose,
            R.map(
              entity =>
                R.converge(R.assocPath([model, 'entities']), [
                  R.compose(
                    R.merge(R.__, normalizedData.entities[entity]),
                    R.pathOr({}, [model, 'entities']),
                  ),
                  R.identity,
                ]),
              R.compose(R.keys, R.prop('entities'))(normalizedData),
            ),
          ),
          /* concat result to model.arrays.arrayId */
          R.converge(R.assocPath([model, 'arrays', arrayId]), [
            R.compose(
              R.concat(normalizedData.result),
              R.pathOr([], [model, 'arrays', arrayId]),
            ),
            R.identity,
          ]),
        )(state);
        return result;
      },
    },
    initialState,
  );

  return reducer;
};

export default createReducer;
