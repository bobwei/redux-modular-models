import { createStore, combineReducers } from 'redux';
import { schema } from 'normalizr';

import { createReducer, arrayConcat } from '../src/index';

describe('can concat empty array', () => {
  const options = { idAttribute: 'objectId' };
  const userSchema = new schema.Entity('user', {}, options);
  const itemSchema = new schema.Entity('item', { user: userSchema }, options);
  const rootReducer = combineReducers({
    models: createReducer({
      models: [
        {
          name: 'user',
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
        },
      ],
    }),
  });
  const store = createStore(rootReducer);
  const { getState, dispatch } = store;

  test('initialState', () => {
    expect(getState()).toEqual({
      models: {
        user: {
          entities: {},
          arrays: {
            all: [],
          },
        },
        item: {
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
        collection: {
          entities: {},
          arrays: {
            all: [],
          },
        },
      },
    });
  });

  test('arrayConcat', () => {
    dispatch(arrayConcat([], 'item', 'all'));
    expect(getState()).toEqual({
      models: {
        user: {
          entities: {},
          arrays: {
            all: [],
          },
        },
        item: {
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
        collection: {
          entities: {},
          arrays: {
            all: [],
          },
        },
      },
    });
  });
});
