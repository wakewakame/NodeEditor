const path = require('path');

module.exports = {
	mode: 'development',
	entry: './src/main.js',
	output: {
		filename: 'hydrangea.js',
		path: path.join(__dirname, 'dst')
	}
};
