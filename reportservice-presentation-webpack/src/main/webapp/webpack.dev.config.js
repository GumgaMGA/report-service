const path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, 'app', 'app'),
    output: {
        path: path.join(__dirname, 'dist/'),
        filename: 'app-dev.js',
        publicPath: '/dist/'
    },
    devServer: {
        inline: true,
        open: true,
        port: 1111
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "app-dev.css",
            allChunks: true
        }),
        new webpack.IgnorePlugin(/\.\/locale$/),
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
                        loader: 'babel-loader',
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
};
