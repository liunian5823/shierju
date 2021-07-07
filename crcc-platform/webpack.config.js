const fs = require("fs");
const path = require("path");
const dir = path.join.bind(path, __dirname);
const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "dev";
const rootPath = path.resolve(__dirname, '');

const webpack = require("webpack");
const merge = require("webpack-merge");
const HappyPack = require("happypack");
const Es3ifyPlugin = require("es3ify-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const currentConfig = require(!isDev ? "./webpack.cfg" : "./webpack.cfg.dev");
const commonConfig = {
	entry: {
		shim: [
			"es5-shim", // 支持 IE8 所必须,且顺序在babel-polyfill前
			"es5-shim/es5-sham",
			"console-polyfill",
			"babel-polyfill",
			"media-match", // 支持 antd 所必须
		],
		public: [
			dir("src/utils/public.js"),
		],
	},
	output: {
		path: dir("platform"),
		filename: "js/[name].[chunkhash:5].js",
		// 用import()按需加载 https://doc.webpack-china.org/api/module-methods/#import-
		chunkFilename: "js/[name].[chunkhash:5].js",
		publicPath: "./",
	},
	module: {
		postLoaders: [{
			test: /\.jsx?$/i,
			loader: "happypack/loader?cacheDirectory=true&id=pre",
		}],
		loaders: [
			{
				test: /\.jsx?$/i,
				loader: "happypack/loader?cacheDirectory=true&id=jsx",
				include: dir("src"),
				exclude: dir("src/static"),
			},
			{
				test: /\.(jpe?g|png|gif|bmp|ico)(\?.*)?$/i,
				loader: "url-loader?limit=1000000&name=img/[name].[hash:5].[ext]",
			},
			{
				test: /\.(woff2?|svg|ttf|otf|eot)(\?.*)?$/i,
				loader: "url-loader?limit=6144&name=font/[name].[hash:5].[ext]",
			},
			{
				test: /\.less$/,
				include: [/src/],
				loaders: [
					'style-loader',
					"css?modules&localIdentName=[name]__[local]--[hash:base64:5]",
					'less-loader'
				],
			},
			{
				test: /\.less$/,
				include: [/node_modules/],
				loaders: [
					'style-loader',
					"css-loader",
					'less-loader'
				],
			},
		],
	},
	plugins: [
		new webpack.ProvidePlugin({
			React: 'react',
			ComponentDefine: path.join(rootPath, './src/utils/config/componentDefine.js'),
			SystemConfig: path.join(rootPath, './src/utils/config/systemConfig.js'),
		}),
		new HappyPack({
			id: "pre",
			threads: 4,
			loaders: [{
				loader: "export-from-ie8/loader",
				options: {
					cacheDirectory: true,
				},
			}],
		}),
		new HappyPack({
			id: "jsx",
			threads: 4,
			loaders: [{
				loader: "babel-loader",
				options: {
					cacheDirectory: true,
				},
			}],
		}),
		new CopyWebpackPlugin([
			{
				from: "src/static",
				to: "static",
			},
		]),
		new webpack.optimize.CommonsChunkPlugin({
			name: "runtime",
			minChunks: (module, count) => {
				const { resource } = module || {};
				return resource && /\.(vue|jsx?)$/i.test(resource) &&
					resource.indexOf(dir("node_modules")) === 0;
			},
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: "manifest",
			chunks: ["runtime"],
		}),
		/*new webpack.ContextReplacementPlugin(
			/moment[\\/]locale$/i,
			/^\.\/zh-cn$/i,
		),*/
		new webpack.IgnorePlugin(/^\.\/locale$/i, /moment$/i),
		// new Es3ifyPlugin(),
	],
	resolve: {
		alias: {
			/*api: dir("src/api"),
			components: dir("src/components"),
			containers: dir("src/containers"),
			constants: dir("src/constants"),
			reducers: dir("src/reducers"),
			actions: dir("src/actions"),
			routes: dir("src/routes"),
			styles: dir("src/styles"),
			views: dir("src/views"),
			utils: dir("src/utils"),*/
			"@": dir("src"),
		},
		extensions: ["", ".js", ".jsx", ".json"],
	},
	performance: {
		hints: false,
	},
};
const addPagePlugin = name => {
	const app = name || "index";
	commonConfig.entry[app] = [
		dir("src/views/" + app + ".js"),
	];
	commonConfig.plugins.push(
		new HtmlWebpackPlugin({
			filename: app + ".html",
			template: dir("src/index.html"),
			title: "Home Page " + app,
			chunks: ["manifest", "runtime", "shim", "public", app],
			chunksSortMode: "manual",
			inject: true,
			xhtml: true,
			hash: true,
		})
	);
};
const pageList = [""]; // 多页面打包
pageList.forEach(v => addPagePlugin(v));

module.exports = merge(commonConfig, currentConfig);