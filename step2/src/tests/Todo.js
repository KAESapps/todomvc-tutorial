define([
	'intern!object',
	'intern/chai!assert',
	'../Model',
	'../Todo'
], function(
	registerSuite,
	assert,
	Model,
	Todo
){
	var todoStore = new Model();

	registerSuite({
		name: "Afficheur de tâche",
		display: function() {
			var todoCmp = new Todo(todoStore.item(todoStore.add({
				label: "My first task",
				done: false,
				creation: new Date()
			})));
			document.body.appendChild(todoCmp.domNode);
			
			todoCmp = new Todo(todoStore.item(todoStore.add({
				label: "My done task",
				done: true,
				creation: new Date()
			})));
			document.body.appendChild(todoCmp.domNode);
		},
	});
});