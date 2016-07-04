var path = require("path");

// module.exports = {
//   context: __dirname,
//   entry: "./frontend/picturegram.jsx",
//   output: {
//     path: path.join(__dirname, 'app', 'assets', 'javascripts'),
//     filename: "bundle.js",
//     devtoolModuleFilenameTemplate: '[resourcePath]',
//     devtoolFallbackModuleFilenameTemplate: '[resourcePath]?[hash]'
//   },
//   module: {
//     loaders: [
//       {
//         test: /\.jsx?$/,
//         exclude: /(node_modules|bower_components)/,
//         loader: 'babel',
//         query: {
//           presets: ['react']
//         }
//       }
//     ]
//   },
//   devtool: 'source-maps',
//   resolve: {
//     extensions: ["", ".js", ".jsx" ]
//   }
// };


module.exports = {
  context: __dirname,
  entry: "./frontend/picturegram.jsx",
  output: {
    path: "./app/assets/javascripts",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react']
        }
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: ["", ".js", ".jsx"]
  }
};
