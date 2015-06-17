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

app.width(400).left(10).top(10).containerVisible(true).parentNode(document.body);
document.body.style.background= 'lightgray';