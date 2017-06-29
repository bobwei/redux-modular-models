/* eslint-disable import/prefer-default-export */
import { createAction } from 'redux-actions';

const modulePrefix = '@@redux-modular-models/';

export const arrayRemoveAll = createAction(
  `${modulePrefix}arrayRemoveAll`,
  undefined,
  (model, arrayId) => ({ model, arrayId }),
);

export const arrayConcat = createAction(
  `${modulePrefix}arrayConcat`,
  undefined,
  (payload, model, arrayId, options: { reset: boolean } = {}) => ({
    model,
    arrayId,
    options,
  }),
);

export const entityMerge = createAction(
  `${modulePrefix}entityMerge`,
  undefined,
  (payload, model) => ({ model }),
);
