var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function(config) {
  config.set({
    files: [
      'node_modules/angular/angular.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'dist/app-prod.min.js',
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
      entry: path.join(__dirname, 'app', 'app'),
      output: {
          path: path.join(__dirname, 'dist/'),
          publicPath: 'dist/',
          filename: 'app-prod.min.js'
      },
      plugins: [
          new webpack.IgnorePlugin(/\.\/locale$/),
          new UglifyJSPlugin({
              include: /\.min\.js$/,
              beautify: true,
              comments: false,
              minimize: true,
              mangle: false,
              compress: {
                  warnings: false
              }
          }),
          new ExtractTextPlugin({
              filename: "app-prod.min.css",
              allChunks: true
          }),
          new OptimizeCssAssetsPlugin({
              assetNameRegExp: /\.min\.css$/,
              cssProcessor: require('cssnano'),
              cssProcessorOptions: { discardComments: {removeAll: true } },
              canPrint: true
          }),
          new webpack.ProvidePlugin({
           $: "jquery",
           jQuery: "jquery",
           "window.jQuery": "jquery"
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
                  use: "file-loader?name=public/icons/[name].[ext]"
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
