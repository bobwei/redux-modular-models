import { createStore, combineReducers } from 'redux';
import { schema } from 'normalizr';

import { createReducer, getEntities } from '../src/index';

describe('selectors', () => {
  const options = { idAttribute: 'objectId' };
  const userSchema = new schema.Entity('user', {}, options);
  const itemSchema = new schema.Entity('item', { user: userSchema }, options);
  const collectionSchema = new schema.Entity(
    'collection',
    { user: userSchema },
    options,
  );

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
          schema: collectionSchema,
        },
      ],
    }),
  });
  const store = createStore(rootReducer);

  test('getEntities', () => {
    const { getState } = store;
    const selector = getEntities();
    expect(selector(getState())).toEqual({
      user: {},
      item: {
        '1': {
          objectId: 1,
          title: 'item1',
        },
      },
      collection: {},
    });
  });
});
