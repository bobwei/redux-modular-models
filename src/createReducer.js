// @flow
import R from 'ramda';
import { handleActions } from 'redux-actions';
import { normalize } from 'normalizr';
import { REHYDRATE } from 'redux-persist/constants';

import REDUCER_KEY from './constants/REDUCER_KEY';
import createInitialState from './createInitialState';
import { arrayRemoveAll, arrayConcat, entityMerge } from './actions';

type Options = {
  /* Used to know it's key name in combineReducers */
  reducerKey: string,
  models: Array<{
    name: string,
    initialState: any,
    schema: any,
  }>,
};

const createReducer = ({ reducerKey = REDUCER_KEY, models }: Options) => {
  const initialState = createInitialState(models);
  const indexedModels = R.indexBy(R.prop('name'))(models);

  const reducer = handleActions(
    {
      [arrayRemoveAll]: (state, { meta: { model, arrayId } }) =>
        R.assocPath([model, 'arrays', arrayId], [], state),
      [arrayConcat]: (
        state,
        { payload, meta: { model, arrayId, options } },
      ) => {
        /* array of schema */
        const schema = R.compose(R.of, R.path([model, 'schema']))(
          indexedModels,
        );
        const normalizedData = normalize(payload, schema);
        const { reset = false } = options;
        const result = R.compose(
          /* for each entity in normalizedData.entities, merge to model.entities */
          R.apply(R.compose, [
            R.identity,
            ...R.map(
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
          ]),
          /* concat result to model.arrays.arrayId */
          R.converge(R.assocPath([model, 'arrays', arrayId]), [
            R.compose(
              R.concat(R.__, normalizedData.result),
              R.ifElse(
                R.always(reset),
                R.always([]),
                R.pathOr([], [model, 'arrays', arrayId]),
              ),
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
      /*
        Merge initialState and rehydratedState with mergeDeepRight.
        Ignore special key 'schemas' from rehydratedState since we do not handle
        serialization correctly. So for now, just ignore it.
      */
      [REHYDRATE]: R.useWith(R.mergeDeepRight, [
        R.identity,
        R.compose(
          R.map(R.dissoc('schemas')),
          R.propOr({}, reducerKey),
          R.propOr({}, 'payload'),
        ),
      ]),
    },
    initialState,
  );

  return reducer;
};

export default createReducer;
