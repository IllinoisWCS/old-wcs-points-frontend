const webpack = require('webpack');
const path = require('path');
const copy = require('copy-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, 'public');
const APP_DIR = path.resolve(__dirname, 'src');

const config = {
  entry: {
    app: [`${APP_DIR}/index.jsx`],
    vendor: ['react', 'react-dom', 'react-router'],
  },

  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: '/',
  },

  context: path.join(__dirname, 'src'),

  module: {
    loaders: [
      {
        test: /\.jsx?/,
        exclude: [/node_modules/, /bower_components/],
        include: APP_DIR,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env'],
        },
      },

      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      },

      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
      },
    ],
  },

  devServer: {
    historyApiFallback: true,
  },

  plugins: [
    new copy(
      [
        { from: `${APP_DIR}/html/`, to: BUILD_DIR },
        { from: `${APP_DIR}/assets/`, to: `${BUILD_DIR}/assets/` },
      ],
      {
        copyUnmodified: false,
        debug: 'debug',
      },
    ),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.bundle.js',
    }),
  ],
};

module.exports = config;
