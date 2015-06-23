/* global __dirname */
var loadFont = require('ksf/dom/style/loadFont');
var fs = require('fs');

var mainFontName = 'Lato';
loadFont(fs.readFileSync(__dirname + '/./lato-light.woff', 'base64'), mainFontName);

module.exports = {
	font: mainFontName,
};