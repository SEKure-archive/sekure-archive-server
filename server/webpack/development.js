const path = require('path');
const webpack = require('webpack');

const loaders = require('./loaders');

module.exports = {
    entry: ['./src/index.ts'],
    output: { path: 'target', filename: 'index.js' },
    target: 'node',
    devtool: 'inline-eval-cheap-source-map',
    module: { loaders: loaders, exprContextCritical: false },
    resolve: {
        modules: [path.join(__dirname, 'src'), 'node_modules'],
        extensions: ['.js', '.ts'],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.BCRYPT_ROUNDS': 5,
            'process.env.JWT_SECRET': JSON.stringify('TOPSECRET'),
        }),
    ],
};
