# redux-modular-models

Manage models state for CRUD with ease.

- [Usage Example](#usage-example)


## Usage Example

The store should know how to handle actions. To enable this, we need to create the modelReducer to your store. It serves for all of your models, so you only have to pass it once.

#### Create model reducer

```js
import { createStore, combineReducers } from 'redux';
import { createReducer } from 'redux-modular-models';

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
```

```js
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
```

#### Dispatch actions to update state

Remove all from array with model === 'item' && arrayId === 'all'

```js
dispatch(arrayRemoveAll('item', 'all'));
```

```js
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
```

Concat data to array with model === 'item' && arrayId === 'all'

```js
const data = [
  { objectId: 1, title: 'item1', user: { objectId: 1, name: 'Bob Wei' } },
  { objectId: 2, title: 'item2' },
];
dispatch(arrayConcat(data, 'item', 'all'));
```

```js
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
```

### Denormalize data and mapStateToprops

Create efficient selector with reselect
```js
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
```

mapStateToprops
```js
expect(selector(getState())).toEqual({
  itemList: [
    { objectId: 1, title: 'item1', user: { objectId: 1, name: 'Bob Wei' } },
    { objectId: 2, title: 'item2' },
  ],
});
```
