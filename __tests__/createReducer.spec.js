import { createStore, combineReducers } from 'redux';

import createReducer from '../src/createReducer';
import { arrayRemoveAll } from '../src/actions';

it('can createReducer', () => {
  const rootReducer = combineReducers({
    models: createReducer({
      models: [
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
        },
        {
          name: 'collection',
        },
      ],
    }),
  });
  const store = createStore(rootReducer);
  const { getState, dispatch } = store;
  expect(getState()).toEqual({
    models: {
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
  dispatch(arrayRemoveAll('item', 'all'));
  expect(getState()).toEqual({
    models: {
      item: {
        entities: {
          '1': {
            objectId: 1,
            title: 'item1',
          },
        },
        arrays: {
          all: [],
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
