const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
      portfolioshare: path.resolve(__dirname, 'src/portfolioshare'),
      fortyyearannual: path.resolve(__dirname, 'src/fortyyearannual')
    },
    output: {
      filename: '[name].js',
      path: __dirname + '/dist'
    },
    plugins: [
      new webpack.EnvironmentPlugin({ 
        API_URL: 'http://localhost:8000',
        PRODUCTION: true
      })
    ],
    module: {
      rules: [{
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: ['babel-loader']
      }]
    },
};
