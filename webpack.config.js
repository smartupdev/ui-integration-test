const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {

  entry: {
    index: './src/index/index.js',
    ipfs: './src/component/ipfs.js',
    orbitdb: './src/component/orbitdb.js',
    gun: './src/component/gun.js',
  },
  
  output: {
    filename: './[name].[chunkhash:4].js',
  },

  plugins: [
    new HtmlWebpackPlugin({
        filename:'./index.html',
        template:'./src/index/index.html',
        hash:true,
        chunks:['index'],
    })
  ],

  devServer: {
    port: 8080,
    contentBase: path.join(__dirname, 'dist')
  }

}