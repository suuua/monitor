const path = require('path');

var webpackConfig = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@D': path.resolve(__dirname, '../dist')
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  mode: 'development',
  devtool: 'inline-source-map'
};

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    browsers: ['Chrome'],
    files: [
      { pattern: '../test/unit/spec/**/*.spec.js', watched: false },
      // '../dist/**/*.js',
    ],
    preprocessors: {
      '../test/unit/spec/**/*.spec.js': ['webpack', 'sourcemap'],
      // '../dist/**/*.js': 'coverage',
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },
    reporters: ['spec', 'coverage'],
    coverageReporter: {
      dir: '../coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    }
  });
};