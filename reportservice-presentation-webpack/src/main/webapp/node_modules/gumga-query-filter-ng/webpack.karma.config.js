// Karma configuration

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const baseName = "gumga-query-filter";

module.exports = function(config) {
  config.set({
    files: [
      'node_modules/angular/angular.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'dist/'+baseName+'.js',
      'test/test.js'
    ],

    // frameworks to use
    frameworks: ['jasmine'],

    preprocessors: {
      '*.js': ['jshint'],
      'test/test.js': ['webpack'],
    },

    reporters: ['coverage', 'progress'],

    coverageReporter: {
      dir: 'build/coverage/',
      reporters: [
          { type: 'html' },
          { type: 'text' },
          { type: 'text-summary' }
      ]
    },

    webpack: {
      entry: path.join(__dirname, 'src', 'index'),
      output: {
          path: path.join(__dirname, 'dist/'),
          filename: baseName+'.js',
          publicPath: '/dist/'
      },
      plugins: [
          new ExtractTextPlugin({
              filename: baseName+".css",
              allChunks: true
          })
      ],
      module: {
          rules: [
              {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                  {
                    loader: 'babel-loader'
                  }
                ]
              },
              {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader'
                })
              },
              {
                test: /\.(jpe?g|png|gif|svg|eot|woff2|woff|ttf)$/i,
                use: "file-loader?name=assets/[name].[ext]"
              }
          ]
      }
    },

    webpackMiddleware: {
      noInfo: true
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_WARN,

    autoWatch: true,

    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: true,
      clearImmediate: false,
      setImmediate: false
    },

    jshintPreprocessor: {
      jshintrc: './.jshintrc'
    },

    plugins: [
      require("karma-webpack"),
      require("istanbul-instrumenter-loader"),
      require("karma-jasmine"),
      require("karma-jshint-preprocessor"),
      require("karma-coverage"),
      require("karma-chrome-launcher"),
      require("karma-spec-reporter")
    ],

    browsers: ['Chrome']

  });
};
