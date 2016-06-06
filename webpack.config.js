"use strict";

const webpack = require('webpack');
const path = require('path');

const APP_DIR = path.resolve(__dirname, 'front');
const BUILD_DIR = path.resolve(__dirname, 'build');

module.exports = {
	devtool: 'source-map',
	entry: [
		'webpack-dev-server/client?http://localhost:8080',
		'webpack/hot/dev-server',
		APP_DIR  + '/index.jsx'
	],
	output: {
		path: BUILD_DIR,
    	filename: 'bundle.js',
    	publicPath: "/"
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	module : {
		loaders : [
			{
				test : /\.jsx?/,
				include: APP_DIR,
				exclude: '/node_modules/',
				loaders : ['react-hot', 'babel']
			},

      		{ 
      			test: /\.json$/, 
      			loader: 'json-loader' 
      		},

  			{ 
  				test: /\.scss$/, 
  				loader: "style!css!autoprefixer!sass" 
  			},

			{ 
				test: /\.css$/, 
				loader: "style-loader!css-loader?modules" 
			}
		],

		noParse: /node_modules\/json-schema\/lib\/validate\.js/
	},

	node: {
    	net: "empty",
    	tls: "empty",
    	fs: "empty",
    }
};
