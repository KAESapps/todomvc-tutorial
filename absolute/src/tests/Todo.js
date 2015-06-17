var Todo = require('../Todo');
var DeepStore = require('ksf/observable/deep/Store');
var DeepBranch = require('ksf/observable/deep/Branch');

var todoValue = new DeepStore({
	'/label': "I really should do that",
	'/done': false
});

var todo = new Todo(new DeepBranch(todoValue, ''));

todo.width(400).left(10).top(10).containerVisible(true).parentNode(document.body);
document.body.style.background= 'lightgray';