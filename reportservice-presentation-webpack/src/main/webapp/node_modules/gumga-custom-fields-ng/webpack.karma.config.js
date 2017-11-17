// Karma configuration

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const baseName = "gumga-custom-fields";

module.exports = function(config) {
  config.set({

    files: [
      'node_modules/angular/angular.min.js',
      'dist/'+baseName+'.min.js',
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
      entry: path.join(__dirname, 'src', 'gumga-custom-fields'),
      output: {
          path: path.join(__dirname, 'dist/'),
          filename: baseName + '.min.js'
      },
      plugins: [
          new UglifyJSPlugin(),
          new ExtractTextPlugin({
              filename: baseName + ".min.css",
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
          }]

      }
    },

    webpackMiddleware: {
      noInfo: true
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

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