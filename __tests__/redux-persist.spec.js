import { createStore, combineReducers } from 'redux';
import { schema } from 'normalizr';
import { persistStore, autoRehydrate } from 'redux-persist';

import { createReducer } from '../src/index';

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
  const store = createStore(rootReducer, {}, autoRehydrate());
  const { getState } = store;

  it('should use mergeDeepLeft as merge strategy when merging initialState and rehydrate state', () =>
    new Promise((resolve, reject) => {
      persistStore(
        store,
        {
          storage: {
            data: {
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
              testKey: {
                data: 'test data',
              },
            },
            getItem(key, cb) {
              const serializedData = JSON.stringify(this.data[key]);
              process.nextTick(() => cb(null, serializedData));
            },
            getAllKeys(cb) {
              process.nextTick(() => cb(null, Object.keys(this.data)));
            },
          },
          keyPrefix: '',
        },
        () => {
          try {
            expect(getState()).toHaveProperty('models.user.schemas');
            expect(getState()).toHaveProperty('models.item.schemas');
            expect(getState()).toHaveProperty('models.collection.schemas');
            expect(Object.keys(getState().models)).toEqual([
              'user',
              'item',
              'collection',
            ]);
            resolve();
          } catch (e) {
            reject(e);
          }
        },
      );
    }));
});
