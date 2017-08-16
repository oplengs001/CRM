var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry : path.join(__dirname, '/client/index.js'),
	output : {
		path : __dirname,
		filename : 'bundle.js'
	},
	module : {
		loaders : [
			{
				test: /.jsx?$/,
				loaders: 'babel-loader',
				exclude : /node_modules/,
				query : {
					presets : ['es2015','react']
				}
			},
			{
				test : /\.handlebars$/,
				loaders : 'handlebars-loader',
				query : {
					presets : ['es2015']
				}
			}
		]
	},
	resolve : {
		extensions : ['.js','.jsx']
	}
}