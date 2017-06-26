import path from 'path';

const SRC_PATH = path.join(__dirname, 'src');
const LIB_PATH = path.join(__dirname, 'lib');

const config = {
  entry: [SRC_PATH],
  output: {
    path: LIB_PATH,
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  externals: {
    normalizr: 'normalizr',
    ramda: 'ramda',
    redux: 'redux',
    'redux-actions': 'redux-actions',
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel-loader', 'eslint-loader'],
        include: SRC_PATH,
        exclude: /node_modules/,
      },
    ],
  },
};

export default config;
