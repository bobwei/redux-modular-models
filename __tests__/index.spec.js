import { createStore, combineReducers } from 'redux';
import { schema, denormalize } from 'normalizr';
import { createSelector } from 'reselect';
import R from 'ramda';

import createReducer from '../src/createReducer';
import { arrayRemoveAll, arrayConcat } from '../src/actions';

it('can createReducer and update state with actions', () => {
  const itemSchema = new schema.Entity('item', {}, { idAttribute: 'objectId' });
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

  const data = [
    { objectId: 1, title: 'item1' },
    { objectId: 2, title: 'item2' },
  ];
  dispatch(arrayConcat(data, 'item', 'all'));
  expect(getState()).toEqual({
    models: {
      item: {
        entities: {
          '1': {
            objectId: 1,
            title: 'item1',
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

  const selector = createSelector(
    /* item entities */
    R.path(['models', 'item', 'entities']),
    /* item array with arrayId === 'all' */
    R.path(['models', 'item', 'arrays', 'all']),
    (item, itemList) => ({
      itemList: denormalize(itemList, [itemSchema], { item }),
    }),
  );
  expect(selector(getState())).toEqual({
    itemList: [
      { objectId: 1, title: 'item1' },
      { objectId: 2, title: 'item2' },
    ],
  });
});