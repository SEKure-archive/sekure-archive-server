const path = require('path');
const webpack = require('webpack');

const loaders = require('./loaders');

module.exports = {
    entry: ['./src/index.ts'],
    output: { path: 'target', filename: 'index.js' },
    target: 'node',
    devtool: 'source-map',
    module: { loaders: loaders, exprContextCritical: false },
    resolve: {
        modules: [path.join(__dirname, 'src'), 'node_modules'],
        extensions: ['.js', '.ts'],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.BCRYPT_ROUNDS': 13,
        }),
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            comments: false,
        }),
    ],
};
