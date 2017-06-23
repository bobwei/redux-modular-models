import R from 'ramda';

const createInitialState = R.compose(
  R.mergeAll,
  R.map(({ name, initialState }) => ({
    [name]: {
      entities: {},
      arrays: {
        all: [],
      },
      ...initialState,
    },
  })),
);

export default createInitialState;
