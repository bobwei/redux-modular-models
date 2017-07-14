import R from 'ramda';

const createInitialState = R.compose(
  R.mergeAll,
  R.map(({ name, schema, initialState }) => ({
    [name]: {
      entities: {},
      arrays: {
        all: [],
      },
      schemas: {
        entity: schema,
        array: [schema],
      },
      ...initialState,
    },
  })),
);

export default createInitialState;
