var webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: './',
    filename: 'my-profile-embedded.js'
  },
  devServer: {
    inline: true,
    port: 1111
  },
  plugins: [
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          "presets": ["es2015", "stage-0"]
        }
      }
    ]
  }
}
