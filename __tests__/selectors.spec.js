import { createStore, combineReducers } from 'redux';
import { schema } from 'normalizr';
import { createStructuredSelector } from 'reselect';

import { createReducer, getEntities, getSchema, getObject } from '../src/index';

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

  test(`getSchema('item', 'entity')`, () => {
    const { getState } = store;
    const selector = getSchema('item', 'entity');
    expect(selector(getState())).toEqual(itemSchema);
  });

  test(`getSchema('item', 'array')`, () => {
    const { getState } = store;
    const selector = getSchema('item', 'array');
    expect(selector(getState())).toEqual([itemSchema]);
  });

  test('getObject', () => {
    const { getState } = store;
    const selector = getObject('item', '1');
    expect(selector(getState())).toEqual({
      objectId: 1,
      title: 'item1',
    });
  });

  test('mapStateToProps with getObject', () => {
    const { getState } = store;
    const mapStateToProps = createStructuredSelector({
      item: getObject('item', '1'),
    });
    expect(mapStateToProps(getState())).toEqual({
      item: {
        objectId: 1,
        title: 'item1',
      },
    });
  });
});
