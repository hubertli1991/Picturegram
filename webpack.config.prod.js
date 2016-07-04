var webpack = require("webpack");

// "scripts": {
//   "postinstall": "./node_modules/.bin/webpack"
// }

module.exports = {
  context: __dirname,
  entry: "./frontend/picturegram.jsx",
  output: {
    path: path.join(__dirname, 'app', 'assets', 'javascripts'),
    filename: "bundle.js",
    devtoolModuleFilenameTemplate: '[resourcePath]',
    devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
  },
  plugins:[
    new webpack.DefinePlugin({
     'process.env':{
       'NODE_ENV': JSON.stringify('production')
     }
    }),
    new webpack.optimize.UglifyJsPlugin({
     compress:{
       warnings: true
     }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react']
        }
      }
    ]
  },
  devtool: 'source-maps',
  resolve: {
    extensions: ["", ".js", ".jsx" ]
  }
};
