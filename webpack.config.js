/* eslint-disable no-undef */
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';  // Import webpack as a default export
import { GenerateSW } from 'workbox-webpack-plugin';

const { DefinePlugin } = webpack;  // Destructure DefinePlugin from the webpack object

export default {
    entry: './src/main.jsx',
    output: {
        path: path.resolve(process.cwd(), 'dist'),
        filename: '[name].[contenthash].js',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
        new GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
        }),
    ],
    devServer: {
        static: path.join(process.cwd(), 'dist'),
        compress: true,
        port: 5173,
        hot: true,
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        minimize: true,
    },
    devtool: 'inline-source-map',
};
