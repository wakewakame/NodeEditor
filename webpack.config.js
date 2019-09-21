const path = require('path');

module.exports = {
	mode: 'development',
	entry: './src/main.js',
	output: {
		filename: 'node_editor.js',
		path: path.join(__dirname, 'dst'),
		publicPath: '/dst/'
	}
};
