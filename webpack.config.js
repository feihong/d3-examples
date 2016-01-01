const path = require('path')
const webpack = require('webpack')


module.exports = {
  entry: {
    'hello-world': './site/hello-world/app.es6',
    'tweets': './site/tweets/app.es6',
    'world-cup': './site/world-cup/app.es6',
    // This comment marks where new entry points will be added
  },
  output: {
    path: path.resolve('site'),
    filename: '[name]/bundle.js'
  },
  resolve: {
    alias: {
      lib: path.resolve('site/lib')
    },
    extensions: ['', '.webpack.js', '.web.js', '.js', '.es6']
  },
  module: {
    loaders: [
      {
        test: /\.es6$/,
        include: [
          path.resolve('site')
        ],
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
          cacheDirectory: true
        }
      }
    ]
  }
}
