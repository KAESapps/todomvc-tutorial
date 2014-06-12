define([
	'compose',
	'ksf/dom/composite/_Composite',
	'ksf-ui/widget/base/Label',
	'ksf-ui/layout/Flow',
	'ksf-ui/list/ItemList',
	'./Todo',
	'./Model',
	'ksf/dom/style/JSS',
], function(
	compose,
	_Composite,
	Label,
	Flow,
	ItemList,
	Todo,
	Model,
	JSS
){
	return compose(_Composite, {
		_rootFactory: function() {
			return new Flow();
		}
	}, function() {
		var title = new Label("todos");
		title.style(new JSS({
			display: 'block',
			fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
			fontSize: '70px',
			fontWeight: 'bold',
			textAlign: 'center',
			color: 'rgba(255, 255, 255, 0.3)',
			textShadow: '-1px -1px rgba(0, 0, 0, 0.2)'
		}));

		var list = compose.create(ItemList, {
			_itemFactory: function(todo) {
				return new Todo(todo);
			}
		});
		
		this._root.content([
			title,
			list
		]);

		var todoStore = new Model();
		todoStore.add({
			label: "My second task",
			done: false,
			creation: new Date(2)
		});
		todoStore.add({
			label: "This first task is done",
			done: true,
			creation: new Date(1)
		});

		// list todos sorted by creation timestamp, oldest first
		list.content(todoStore.sort(function(a, b) {
			return a.creation - b.creation;
		}));
	});
});