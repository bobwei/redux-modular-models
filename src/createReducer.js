// @flow
import R from 'ramda';
import { handleActions } from 'redux-actions';
import { normalize } from 'normalizr';

import createInitialState from './createInitialState';
import { arrayRemoveAll, arrayConcat, entityMerge } from './actions';

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
              entityModel =>
                R.converge(R.assocPath([entityModel, 'entities']), [
                  R.compose(
                    R.mergeDeepLeft(normalizedData.entities[entityModel]),
                    R.pathOr({}, [entityModel, 'entities']),
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
      [entityMerge]: (state, { payload, meta: { model } }) => {
        const schema = R.compose(R.path([model, 'schema']))(indexedModels);
        const normalizedData = normalize(payload, schema);
        const result = R.compose(
          /* for each entity in normalizedData.entities, merge to model.entities */
          R.apply(
            R.compose,
            R.map(
              entityModel =>
                R.converge(R.assocPath([entityModel, 'entities']), [
                  R.compose(
                    R.mergeDeepLeft(normalizedData.entities[entityModel]),
                    R.pathOr({}, [entityModel, 'entities']),
                  ),
                  R.identity,
                ]),
              R.compose(R.keys, R.prop('entities'))(normalizedData),
            ),
          ),
        )(state);
        return result;
      },
    },
    initialState,
  );

  return reducer;
};

export default createReducer;
