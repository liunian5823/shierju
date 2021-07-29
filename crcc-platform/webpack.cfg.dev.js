const path = require('path');
const dir = path.join.bind(path, __dirname);

const webpack = require('webpack');
const HappyPack = require('happypack');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const devConfig = {
  devtool: 'cheap-eval-source-map',
  // devtool: "cheap-module-eval-source-map",
  output: {
    /*这里本来应该是[chunkhash]的，但是由于[chunkhash]和webpack-dev-server --hot不兼容。只能妥协*/
    filename: 'js/[name].[hash:5].js',
  },
  module: {
    loaders: [
      {
        test: /_\.css$/i,
        loader: 'happypack/loader?cacheDirectory=true&id=cssm',
      },
      {
        test: /[^_]\.css$/i,
        loader: 'happypack/loader?cacheDirectory=true&id=css',
      },
      // {
      // 	test: /\.less$/i,
      // 	loader: "happypack/loader?cacheDirectory=true&id=less",
      // },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        SYS_ENV: JSON.stringify(process.env.SYS_ENV),
      },
    }),
    new HappyPack({
      id: 'cssm',
      threads: 4,
      loaders: [
        'style-loader',
        'css-loader?modules&localIdentName=[name]_[local]_[hash:base64:5]',
      ],
    }),
    new HappyPack({
      id: 'css',
      threads: 4,
      loaders: ['style-loader', 'css-loader', 'postcss-loader'],
    }),
    new HappyPack({
      id: 'less',
      threads: 4,
      loaders: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
    }),
    new FriendlyErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    // new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: dir('dist'),
    historyApiFallback: true,
    compress: true,
    hotOnly: true,
    inline: true, // ie11以下不支持inline
    noInfo: true,
    https: false,
    quiet: false,
    open: false,
    hot: true,
    clientLogLevel: 'error',
    publicPath: '/',
    host: '127.0.0.1',
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://106.39.82.13:8443/',
        changeOrigin: true,
        secure: false,
      },
      /*'/jetty': {
        logLevel: 'debug',
        target: 'https://test.crccmall.com:8443/api',
        changeOrigin: true,
        secure: false,
      },
      '/order': {
        logLevel: 'debug',
        target: 'https://test.crccmall.com:8443/api',
        changeOrigin: true,
        secure: false,
      },
      '/purchaser': {
        logLevel: 'debug',
        target: 'https://test.crccmall.com:8443/api',
        changeOrigin: true,
        secure: false,
      },
      '/financial': {
        logLevel: 'debug',
        target: 'https://test.crccmall.com:8443/api',
        changeOrigin: true,
        secure: false,
      },
      '/common': {
        target: 'https://test.crccmall.com:8443/api',
        changeOrigin: true,
        secure: false,
      },
      '/zuul': {
        logLevel: 'debug',
        target: 'https://test.crccmall.com:8443/api',
        changeOrigin: true,
        secure: false,
      },
      '/inquiry': {
        logLevel: 'debug',
        target: 'https://test.crccmall.com:8443/api',
        changeOrigin: true,
        secure: false,
      },
      //临时接口
      '/crcc_admin/crcc_dev': {
        logLevel: 'debug',
        target: 'https://easy-mock.com',
        changeOrigin: true,
        pathRewrite: {
          '^/crcc_admin/crcc_dev': '/mock/5b8cbf965ae7a7318a6651f3/crcc_dev',
        },
      },
      //mock接口
      '/crcc_admin/sso': {
        logLevel: 'debug',
        target: 'https://easy-mock.com',
        changeOrigin: true,
        pathRewrite: {
          '^/crcc_admin': '/mock/5b8364d559551105dc06f56a/crcc_sso',
        },
      },
      '/crcc_admin/supplier': {
        logLevel: 'debug',
        target: 'https://easy-mock.com',
        changeOrigin: true,
        pathRewrite: {
          '^/crcc_admin': '/mock/5b94d749dd236325f85bf7e3/crcc_supplier',
        },
      },
      '/crcc_admin/base': {
        logLevel: 'debug',
        target: 'https://easy-mock.com',
        changeOrigin: true,
        pathRewrite: {
          '^/crcc_admin': '/mock/5b94db13dd236325f85bf818/crcc_base',
        },
      },
      '/crcc_admin/message': {
        logLevel: 'debug',
        target: 'https://easy-mock.com',
        changeOrigin: true,
        pathRewrite: {
          '^/crcc_admin':
            '/mock/5b94dbb3dd236325f85bf81e/crcc_microservice-message',
        },
      },
      '/crcc_admin/microservice-contract': {
        logLevel: 'debug',
        target: 'https://easy-mock.com',
        changeOrigin: true,
        pathRewrite: {
          '^/crcc_admin':
            '/mock/5b94db13dd236325f85bf818/crcc_microservice-contract',
        },
      },
      //测试接口
      '/test': {
        logLevel: 'debug',
        target: 'https://test.crccmall.com:8443',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/test': 'api',
        },
      },
      //测试统计接口
      /!*'/crcc/statistics': {
                target: 'http://127.0.0.1:8690',
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/crcc/statistics': ''
                }
            },*!/
      //测试platform接口
      /!*'/crcc/platform': {
                target: 'http://localhost:8700',
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/crcc/platform': ''
                }
            },*!/
      //测试接口
      '/crcc': {
        target: 'https://test.crccmall.com:8443',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/crcc': '/api',
        },
      },
      '/demo': {
        target: 'https://demo.crccmall.com:8443',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/demo': '/api',
        },
      },
      '/wang': {
        logLevel: 'debug',
        target: 'http://10.0.0.198:8046',
        changeOrigin: true,
        pathRewrite: {
          '^/wang': '',
        },
      },
      '/zhu': {
        target: 'http://192.168.77.227:8046',
        changeOrigin: true,
        pathRewrite: {
          '^/zhu': '',
        },
      },
      '/qing': {
        target: 'http://10.0.0.186:8600',
        changeOrigin: true,
        pathRewrite: {
          '^/qing': '',
        },
      },*/
    },
  },
};

module.exports = devConfig;
