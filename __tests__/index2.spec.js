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

  test('arrayConcat with reset', () => {
    const data = [
      { objectId: 1, title: 'item1', user: { objectId: 1, name: 'Bob Wei' } },
      { objectId: 2, title: 'item2' },
    ];
    dispatch(arrayConcat(data, 'item', 'all', { reset: true }));
    expect(getState()).toEqual({
      models: {
        user: {
          entities: {
            '1': {
              objectId: 1,
              name: 'Bob Wei',
            },
          },
          arrays: {
            all: [],
          },
        },
        item: {
          entities: {
            '1': {
              objectId: 1,
              title: 'item1',
              user: 1,
            },
            '2': {
              objectId: 2,
              title: 'item2',
            },
          },
          arrays: {
            all: [1, 2],
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
