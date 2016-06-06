"use strcit";

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

const host = 'localhost';
const port = 8080;

new WebpackDevServer(webpack(config), {
  	publicPath: config.output.publicPath,
  	hot: true,
  	historyApiFallback: true,
  	progress: true,
  	//stats: 'errors-only'
}).listen(port, host, function (err, result) {
  	if (err) { return console.log(err);}
  	console.log('Listening at http://' + host + ':' + port + '/');
});



