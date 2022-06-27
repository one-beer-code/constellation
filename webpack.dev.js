const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
        mode: "development",
        output: {
            filename: '[name].[hash].js',
            path: path.resolve(__dirname, 'dist'),
        },
        devtool: 'inline-source-map',
        devServer: {

        },
        plugins: [
          new MiniCssExtractPlugin()
        ],
        module: {
          rules: [
            {
              test: /\.scss$/,
              use: ['style-loader','css-loader', 'sass-loader']
            }
          ]
        }
    }
);
