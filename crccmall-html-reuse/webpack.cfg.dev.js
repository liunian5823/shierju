const path = require("path");
const dir = path.join.bind(path, __dirname);

const webpack = require("webpack");
const HappyPack = require("happypack");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");

const devConfig = {
    devtool: "cheap-eval-source-map",
    // devtool: "cheap-module-eval-source-map",
    output: {
        /*这里本来应该是[chunkhash]的，但是由于[chunkhash]和webpack-dev-server --hot不兼容。只能妥协*/
        filename: "js/[name].[hash:5].js",
    },
    module: {
        loaders: [
            {
                test: /_\.css$/i,
                loader: "happypack/loader?cacheDirectory=true&id=cssm",
            },
            {
                test: /[^_]\.css$/i,
                loader: "happypack/loader?cacheDirectory=true&id=css",
            }
            // {
            // 	test: /\.less$/i,
            // 	loader: "happypack/loader?cacheDirectory=true&id=less",
            // },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                'SYS_ENV': JSON.stringify(process.env.SYS_ENV)
            },
        }),
        new HappyPack({
            id: "cssm",
            threads: 4,
            loaders: [
                "style-loader",
                "css-loader?modules&localIdentName=[name]_[local]_[hash:base64:5]",
            ],
        }),
        new HappyPack({
            id: "css",
            threads: 4,
            loaders: ["style-loader", "css-loader", "postcss-loader"],
        }),
        new HappyPack({
            id: "less",
            threads: 4,
            loaders: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
        }),
        new FriendlyErrorsPlugin(),
        new webpack.NamedModulesPlugin(),
        // new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        contentBase: dir("dist"),
        historyApiFallback: true,
        compress: true,
        hotOnly: true,
        inline: true, // ie11以下不支持inline
        noInfo: true,
        https: false,
        quiet: false,
        open: false,
        hot: true,
        clientLogLevel: "error",
        publicPath: "/",
        host: "127.0.0.1",
        port: 8001,
        proxy: {
            '/api': {
                target: 'https://106.39.82.13:8443',
                changeOrigin: true,
                secure: false,
            },
            // '/common': {
            //     target: 'http://192.168.0.188:9011',
            //     changeOrigin: true,
            //     secure: false,
            // },
            /*'/test/order': {
                target: 'https://www2.crccmall.com:8443',
                pathRewrite: {
                    '^/test': "/api"
                }
            },
            '/test/purchaser': {
                target: 'https://www2.crccmall.com:8443',
                pathRewrite: {
                    '^/test': "/api"
                }
            },
            '/test/financial': {
                target: 'https://www2.crccmall.com:8443',
                pathRewrite: {
                    '^/test': "/api"
                }
            },
            '/test/common': {
                target: 'https://www2.crccmall.com:8443',
                pathRewrite: {
                    '^/test': "/api"
                },
                logLevel: 'debug'
            },
            '/test/zuul': {
                target: 'https://www2.crccmall.com:8443',
                pathRewrite: {
                    '^/test': "/api"
                }
            },
            '/test/inquiry': {
                target: 'https://www2.crccmall.com:8443',
                pathRewrite: {
                    '^/test': "/api"
                }
            },
            '/test/im': {
                target: 'https://www2.crccmall.com:8443',
                pathRewrite: {
                    '^/test': "/api"
                }
            },
            '/test/sso': {
                target: 'https://www2.crccmall.com:8443',
                changeOrigin: true,
                pathRewrite: {
                    '^/test': '/api'
                },
                logLevel: 'debug'
            },
            '/crccjs': {
                target: 'https://www2.crccmall.com:8443',
                changeOrigin: true,
                secure: false,
            },
            //测试接口
            '/crcc': {
                target: 'https://www2.crccmall.com:8443',
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/crcc': '/api'
                },
            },
            '/test/crcc_dev': {
                target: 'https://easy-mock.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/test/crcc_dev': '/mock/5b8cbf965ae7a7318a6651f3/crcc_dev'
                },
            },
            '/wang': {
                target: 'http://10.0.0.196:8046',
                changeOrigin: true,
                pathRewrite: {
                    '^/wang': ''
                }
            },
            '/zhu': {
                target: 'http://10.0.0.181:8046',
                changeOrigin: true,
                pathRewrite: {
                    '^/zhu': ""
                }
            },
            '/upload': {
                target: 'http://192.168.1.245:9000',
                changeOrigin: true,
                pathRewrite: {
                    '^/upload': ""
                }
            },*/
        }
    },
};

module.exports = devConfig;
