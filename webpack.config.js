module.exports = {
	entry: {
		main: './js/src/main.js'
	},
	output: {
		filename: 'bundle.js',
		path: './js/dist'
	},
	module: {
		resolve: {
			modules: ['js/src']
		}
	}
};