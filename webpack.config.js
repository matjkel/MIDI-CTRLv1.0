var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, "/"),
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./client/script/midi.js",
  output: {
    path: __dirname+"/client/script/",
    filename: "midi.min.js"
  },
  plugins: debug ? [] : [
    new ExtractTextPlugin("style.css"),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {discardComments: {removeAll: true}},
      canPrint: true
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false}),
  ],
}
