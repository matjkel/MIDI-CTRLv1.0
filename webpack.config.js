var webpack = require('webpack');
var path = require('path');
var debug = process.env.NODE_ENV !== "production";

module.exports = {
  context: path.join(__dirname, "/"),
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./client/script/midi.js",
  output: {
    path: __dirname+"/client/script/",
    filename: "midi.min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false}),
  ],
}
