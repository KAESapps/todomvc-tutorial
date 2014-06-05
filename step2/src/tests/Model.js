define([
	'intern!object',
	'intern/chai!assert',
	'../Model',
], function(
	registerSuite,
	assert,
	Model
){
	var todoStore;

	registerSuite({
		name: "Store de tâches",
		beforeEach: function() {
			todoStore = new Model();
		},
		create: function() {
			var data = {
				label: "My first task",
				done: false,
				creation: new Date()
			};

			var id = todoStore.add(data);

			assert.deepEqual(todoStore.item(id).value(), data);
		},
		list: function() {
			var id1 = todoStore.add({
				label: "My first task",
				done: false,
				creation: new Date(1)
			});
			var id2 = todoStore.add({
				label: "My second task",
				done: false,
				creation: new Date(2)
			});

			// list todos sorted by creation timestamp, oldest first
			assert.deepEqual(todoStore.sort(function(a, b) {
				return a.creation - b.creation;
			}).value(), [id1, id2]);
		}
	});
});