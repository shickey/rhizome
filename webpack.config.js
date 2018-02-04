const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './src/js/App.jsx',
    './src/css/rhizome.scss'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }]
        })
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + '/src/index.html'
    }),
    new ExtractTextPlugin({
      filename: 'bundle.css',
      allChunks: true
    })
  ],
  devtool: "source-map"
};