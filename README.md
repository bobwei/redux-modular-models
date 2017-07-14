# redux-modular-models

Manage models state for CRUD with ease.

- [Installation](#installation)
- [Usage Example](#usage-example)


## Installation

```
yarn add redux-modular-models
```


## Usage Example

The store should know how to handle actions. To enable this, we need to create the modelReducer to your store. It serves for all of your models, so you only have to pass it once.

#### Create model reducer

```js
import { createStore, combineReducers } from 'redux';
import { schema } from 'normalizr';

import {
  createReducer,
  arrayRemoveAll,
  arrayConcat,
  entityMerge,
} from '../src/index';

describe('can createReducer and update state with actions', () => {
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

  test('initialState', () => {
    const { getState } = store;
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
  });

  test('arrayRemoveAll', () => {
    const { dispatch, getState } = store;
    dispatch(arrayRemoveAll('item', 'all'));
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
            all: [],
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
  });

  test('arrayConcat with reset', () => {
    const { dispatch, getState } = store;
    const data = [
      { objectId: 1, title: 'item1', user: { objectId: 1, name: 'Bob Wei' } },
      { objectId: 2, title: 'item2' },
    ];
    dispatch(arrayConcat(data, 'item', 'all', { reset: true }));
    expect(getState()).toEqual({
      models: {
        user: {
          entities: {
            '1': { objectId: 1, name: 'Bob Wei' },
          },
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
              user: 1,
            },
            '2': { objectId: 2, title: 'item2' },
          },
          arrays: {
            all: [1, 2],
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
  });

  test('arrayConcat', () => {
    const { dispatch, getState } = store;
    const data = [
      { objectId: 1, title: 'item1', user: { objectId: 1, name: 'Bob Wei' } },
      { objectId: 2, title: 'item2' },
    ];
    dispatch(arrayConcat(data, 'item', 'all'));
    expect(getState()).toEqual({
      models: {
        user: {
          entities: {
            '1': { objectId: 1, name: 'Bob Wei' },
          },
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
              user: 1,
            },
            '2': { objectId: 2, title: 'item2' },
          },
          arrays: {
            all: [1, 2, 1, 2],
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
  });

  test('entityMerge for update', () => {
    const { dispatch, getState } = store;
    dispatch(entityMerge({ objectId: 1, title: 'Hello World' }, 'item'));
    expect(getState()).toEqual({
      models: {
        user: {
          entities: {
            '1': { objectId: 1, name: 'Bob Wei' },
          },
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
              title: 'Hello World',
              user: 1,
            },
            '2': { objectId: 2, title: 'item2' },
          },
          arrays: {
            all: [1, 2, 1, 2],
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
  });

  test('entityMerge for insert', () => {
    const { dispatch, getState } = store;
    dispatch(entityMerge({ objectId: 3, title: 'item3' }, 'item'));
    expect(getState()).toEqual({
      models: {
        user: {
          entities: {
            '1': { objectId: 1, name: 'Bob Wei' },
          },
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
              title: 'Hello World',
              user: 1,
            },
            '2': { objectId: 2, title: 'item2' },
            '3': { objectId: 3, title: 'item3' },
          },
          arrays: {
            all: [1, 2, 1, 2],
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
  });
});

```
