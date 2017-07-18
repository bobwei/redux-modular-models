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

  it('should use mergeDeepRight as merge strategy when merging initialState and rehydratedState', () =>
    new Promise((resolve, reject) => {
      const rehydratedState = {
        models: {
          user: {
            entities: {},
            arrays: {
              all: [],
            },
            schemas: 'key should be ignored',
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
            schemas: 'key should be ignored',
          },
          collection: {
            entities: {},
            arrays: {
              all: [],
            },
            schemas: 'key should be ignored',
          },
        },
      };
      persistStore(
        store,
        {
          storage: {
            data: {
              ...rehydratedState,
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
            /*
              Expected merged state with initialState and rehydratedState
            */
            expect(getState()).toEqual({
              models: {
                user: {
                  entities: {},
                  arrays: {
                    all: [],
                  },
                  schemas: {
                    entity: userSchema,
                    array: [userSchema],
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
                  schemas: {
                    entity: itemSchema,
                    array: [itemSchema],
                  },
                },
                collection: {
                  entities: {},
                  arrays: {
                    all: [],
                  },
                  schemas: {
                    entity: collectionSchema,
                    array: [collectionSchema],
                  },
                },
              },
            });
            resolve();
          } catch (e) {
            reject(e);
          }
        },
      );
    }));
});
