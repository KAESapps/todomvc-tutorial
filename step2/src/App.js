define([
	'ksf/utils/compose',
	'ksf/dom/composite/_Composite',
	'ksf-ui/widget/base/Label',
	'ksf-ui/layout/VFlex',
	'ksf-ui/list/ItemList',
	'./Todo',
	'./Model',
	'ksf/dom/style/JSS',
], function(
	compose,
	_Composite,
	Label,
	VFlex,
	ItemList,
	Todo,
	Model,
	JSS
){
	var style = {
		title: new JSS({
			display: 'block',
			fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
			fontSize: '70px',
			fontWeight: 'bold',
			textAlign: 'center',
			color: 'rgba(255, 255, 255, 0.3)',
			textShadow: '-1px -1px rgba(0, 0, 0, 0.2)'
		})
	};
	return compose(_Composite, function() {
		this._setRoot(new VFlex().content([
			new Label("todos").style(style.title),
			this._own(compose.create(ItemList, {
				_itemFactory: function(todo) {
					return new Todo(todo);
				}
			}), 'list')
		]));

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
		this._owned.list.content(todoStore.sort(function(a, b) {
			return a.creation - b.creation;
		}));
	});
});