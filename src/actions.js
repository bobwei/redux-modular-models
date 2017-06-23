/* eslint-disable import/prefer-default-export */
import { createAction } from 'redux-actions';

const modulePrefix = '@@redux-modular-models/';

export const arrayRemoveAll = createAction(
  `${modulePrefix}arrayRemoveAll`,
  undefined,
  (model, arrayId) => ({ model, arrayId }),
);
