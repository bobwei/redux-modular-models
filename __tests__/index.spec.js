import { createStore, combineReducers } from 'redux';
import { schema, denormalize } from 'normalizr';
import { createSelector } from 'reselect';
import R from 'ramda';

import createReducer from '../src/createReducer';
import { arrayRemoveAll, arrayConcat } from '../src/actions';

it('can createReducer and update state with actions', () => {
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
  dispatch(arrayRemoveAll('item', 'all'));
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
    { objectId: 1, title: 'item1', user: { objectId: 1, name: 'Bob Wei' } },
    { objectId: 2, title: 'item2' },
  ];
  dispatch(arrayConcat(data, 'item', 'all'));
  expect(getState()).toEqual({
    models: {
      user: {
        entities: {
          1: { objectId: 1, name: 'Bob Wei' },
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

  const selector = createSelector(
    /* user entities */
    R.path(['models', 'user', 'entities']),
    /* item entities */
    R.path(['models', 'item', 'entities']),
    /* item array with arrayId === 'all' */
    R.path(['models', 'item', 'arrays', 'all']),
    (user, item, itemList) => ({
      itemList: denormalize(itemList, [itemSchema], { user, item }),
    }),
  );
  expect(selector(getState())).toEqual({
    itemList: [
      { objectId: 1, title: 'item1', user: { objectId: 1, name: 'Bob Wei' } },
      { objectId: 2, title: 'item2' },
    ],
  });
});
