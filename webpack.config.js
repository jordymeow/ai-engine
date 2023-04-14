const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const regexNodeModules = /[\\/]node_modules[\\/]/;
const regexNekoUI = /[\\/]neko-ui[\\/]/;

module.exports = function (env, options) {

	const isProduction = options.mode === 'production';
	const isAnalysis = env && env.analysis === 'true';
	
	const cleanPlugin = new CleanWebpackPlugin({
		protectWebpackAssets: false,
		cleanOnceBeforeBuildPatterns: ["!app/"],
		cleanAfterEveryBuildPatterns: ['!app', '!chatbot.js', '*.LICENSE.txt', '*.map'],
	});
	
	const plugins = [];
	if (isProduction) {
		plugins.push(cleanPlugin);
	}
	if (isAnalysis) {
		plugins.push(new BundleAnalyzerPlugin());
	}
	console.log("Production: " + isProduction);

	const baseConfig = {
		context: __dirname,
		mode: isProduction ? 'production' : 'development',
		plugins: plugins,
		devtool: isProduction ? false : 'source-map',
		externals: {
			"react": "React",
			"react-dom": "ReactDOM"
		},
		output: {
			filename: '[name].js',
			path: __dirname + '/app/',
			chunkLoadingGlobal: 'wpJsonMwai'
		},
		resolve: {
			alias: {
				'@root': path.resolve(__dirname, './app/'),
				'@app': path.resolve(__dirname, './app/js/'),
				'@common': path.resolve(__dirname, './common/js/'),
				'@neko-ui': path.resolve(__dirname, '../neko-ui/'),
				'styled-components': path.resolve('./node_modules/styled-components'),
			}
		},
		module: {
			rules: [{
				test: /\.js$/,
				include: [
					path.resolve(__dirname, './app/js/'),
					path.resolve(__dirname, './common/js/'),
					path.resolve(__dirname, '../neko-ui/'),
				],
				exclude: [
					path.resolve(__dirname, 'node_modules')
				],
				use: {
					loader: 'babel-loader',
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react"]
					}
				},
			}, {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }]
		}
	};

	const adminWebPack = Object.assign({}, baseConfig, {
		entry: {
			index: './app/js/index.js',
		},
		optimization: {
			minimize: isProduction ? true : false,
			splitChunks: {
				chunks: 'all',
				name: 'vendor',
				cacheGroups: {
					vendor: {
						test: function (module) {
							if (module.resource) {
								return (module.context.match(regexNodeModules) || module.context.match(regexNekoUI));
							}
						},
						name: "vendor"
					}
				}
			}
		},
	});

	const chatbotWebPack = Object.assign({}, baseConfig, {
		entry: {
			chatbot: './app/js/chatbot.js'
		},
		optimization: {
			minimize: isProduction ? true : false,
		}
	});

	return [adminWebPack, chatbotWebPack];
};