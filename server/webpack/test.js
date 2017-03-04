const path = require('path');
const webpack = require('webpack');

const loaders = require('./loaders');

module.exports = {
    entry: ['./test/test.ts'],
    output: { path: 'target', filename: 'test.js' },
    target: 'node',
    devtool: 'inline-eval-cheap-source-map',
    module: { loaders: loaders, exprContextCritical: false },
    node: { __dirname: true },
    resolve: {
        modules: [path.join(__dirname, 'test'), 'node_modules'],
        extensions: ['.js', '.ts'],
    },
    plugins: [
        new webpack.DefinePlugin({
            'global.GENTLY': false,
            'process.env.BCRYPT_ROUNDS': 5,
            'process.env.JWT_SECRET': JSON.stringify('TOPSECRET'),
            'process.env.PGSQL_DATABASE': JSON.stringify('sekure_archive_development'),
        }),
    ],
};
