const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	devServer: {
		headers: { "Access-Control-Allow-Origin": "*" },
		historyApiFallback: {
			disableDotRule: true
		},
		host: '0.0.0.0',
		hot: true,
		port: 3001,
		proxy: {
		},
	},

	entry: {
		app: './src/index.tsx'
	},

	mode: 'development',

	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: /\.tsx?$/,
				loader: "ts-loader",
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.ttf$/,
				use: ['file-loader']
			}
		]
	},

	output: {
		filename: '[name].bundle.js',
		chunkFilename: 'js/[id].chunk.js',
		path: __dirname + '/build-dev-server',
		publicPath: '/',
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: 'Dexter',
			template: 'index.template.html',
		})
	],

	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
		fallback: { "url": false },
	},

	watchOptions: {
		ignored: /node_modules/,
	}
}
