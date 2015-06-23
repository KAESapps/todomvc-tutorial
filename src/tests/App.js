var DeepStore = require('ksf/observable/deep/Store');
var App = require('../App');

var dataStore = new DeepStore({
	'/a/created': 12346,
	'/a/label': "Test 2",
	'/a/done': true,
	'/b/created': 12345,
	'/b/label': "Test 1",
	'/b/done': false
});

var app = new App(dataStore);


var container = document.createElement('div');
container.style.position = 'relative';
container.style.width = '400px';
container.style.margin = 'auto';

app.width(400).left(10).top(10).containerVisible(true).parentNode(container);

document.body.appendChild(container);
document.body.style.background= '#EEE';