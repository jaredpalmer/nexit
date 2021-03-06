const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin')
const {
  buildPath,
  clientSrcPath,
  assetsBuildPath,
  publicPath
} = require('./buildConfig')

module.exports = {
  devtool: 'source-map',
  target: 'web',
  // this slows things down, waiting on Webpack #959
  // @see https://github.com/webpack/webpack/issues/959
  cache: false,
  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-helmet',
    ],
    main: [
      'babel-polyfill',
      `${clientSrcPath}/index.js`,
    ],
  },

  output: {
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    sourceMapFilename: '[name]-[chunkhash].map',
    publicPath: publicPath,
    path: assetsBuildPath,
    libraryTarget: 'var',
  },

  module: {
    rules: [
      {
        test: /\.(jpg|jpeg|png|gif|eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 20000,
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules/,
          buildPath,
        ],
        options: {
          presets: [
           'react-app'
          ],
        },
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      '__DEV__': false,
      '__CLIENT__': true,
      '__SERVER__': false
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor-[hash].js',
    }),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      output: {
        comments: false,
      },
      sourceMap: true,
    }),

    new AssetsPlugin({
      filename: 'assets.json',
      path: buildPath
    })
  ]
}
