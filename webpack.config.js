const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/client/app.js',
    mode: "development",
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'src/client/dist')
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'LOCAL_NODE': "http://localhost:7545",
                'MODE': "development"
            }
        })
    ],
    node: {
        net: 'empty',
        tls: 'empty',
        dns: 'empty'
    },
    externals: [{
        xmlhttprequest: '{XMLHttpRequest: XMLHttpRequest}'
    }]
};