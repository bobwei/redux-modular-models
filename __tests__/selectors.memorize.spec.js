import { createStore, combineReducers } from 'redux';
import { schema } from 'normalizr';
import { createSelector } from 'reselect';
import R from 'ramda';

import { createReducer, getObject, getArray } from '../src/index';

describe("selectors should memorize results if state doesn't change", () => {
  const options = { idAttribute: 'objectId' };
  const userSchema = new schema.Entity('user', {}, options);
  const itemSchema = new schema.Entity('item', { user: userSchema }, options);
  const collectionSchema = new schema.Entity(
    'collection',
    { user: userSchema },
    options,
  );

  const rootReducer = combineReducers({
    auth: () => ({
      credentials: {
        objectId: 1,
        sessionToken: '123',
      },
    }),
    models: createReducer({
      models: [
        {
          name: 'user',
          initialState: {
            entities: {
              '1': {
                objectId: 1,
                name: 'Bob Wei',
              },
            },
          },
          schema: userSchema,
        },
        {
          name: 'item',
          initialState: {
            entities: {
              '1': {
                objectId: 1,
                title: 'item1',
              },
            },
            arrays: {
              all: [1],
            },
          },
          schema: itemSchema,
        },
        {
          name: 'collection',
          schema: collectionSchema,
        },
      ],
    }),
  });
  const store = createStore(rootReducer);
  const { getState } = store;

  test('getObject with state', () => {
    const selector = getObject('item', '1');
    expect(selector(getState())).toEqual({
      objectId: 1,
      title: 'item1',
    });
    expect(selector(getState()) === selector(getState())).toBe(true);
    expect(selector(getState()) === selector({ ...getState() })).toBe(false);
  });

  test('getObject with createSelector', () => {
    const selector = createSelector(
      R.identity,
      R.partial(getObject, ['item', '1']),
    );
    expect(selector(getState())).toEqual({
      objectId: 1,
      title: 'item1',
    });
    expect(selector(getState()) === selector(getState())).toBe(true);
  });

  test('getArray with state', () => {
    const selector = getArray('item', 'all');
    expect(selector(getState())).toEqual([
      {
        objectId: 1,
        title: 'item1',
      },
    ]);
    expect(selector(getState()) === selector(getState())).toBe(true);
    expect(selector(getState()) === selector({ ...getState() })).toBe(false);
  });

  test('getArray with createSelector', () => {
    const selector = createSelector(
      R.identity,
      R.partial(getArray, ['item', 'all']),
    );
    expect(selector(getState())).toEqual([
      {
        objectId: 1,
        title: 'item1',
      },
    ]);
    expect(selector(getState()) === selector(getState())).toBe(true);
  });
});
