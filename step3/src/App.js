define([
	'compose',
	"dojo/promise/all",
	'ksf/dom/composite/_Composite',
	'ksf-ui/widget/base/Label',
	'ksf-ui/widget/Label',
	'ksf-ui/widget/base/Button',
	'ksf-ui/widget/input/ShortText',
	'ksf-ui/widget/editable/Checkbox',
	'ksf-ui/layout/Flow',
	'ksf-ui/list/ItemList',
	'./Todo',
	'ksf/dom/style/JSS',
	'ksf/model/Sorted',
], function(
	compose,
	all,
	_Composite,
	Label,
	RLabel,
	Button,
	ShortTextInput,
	Checkbox,
	Flow,
	ItemList,
	Todo,
	JSS,
	Sorted
){
	var ActiveTodoCounter = compose(Label.prototype, function(countAccessor) {
		Label.call(this);
		this._displayCount(countAccessor.value());
		var self = this;
		countAccessor.onChange(function(value) {
			self._displayCount(value);
		});
	}, {
		_displayCount: function(count) {
			this.value(count + " item" + (count !== 1 ? "s" : "") + " left");
		}
	});

	var ClearCompletedButton = compose(Button.prototype, function(countAccessor) {
		Button.call(this);
		this._displayCount(countAccessor.value());
		var self = this;
		countAccessor.onChange(function(value) {
			self._displayCount(value);
		});
	}, {
		_displayCount: function(count) {
			this.value("Clear completed (" + count + ")");
		}
	});

	var TodoList = compose(ItemList, {
		_itemFactory: function(todo) {
			return new Todo(todo);
		}
	});

	return compose(_Composite, {
		_rootFactory: function() {
			return new Flow();
		}
	}, function(todoStore) {

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

		var list = new TodoList();

		var todoInput = new ShortTextInput({
			placeholder: "What needs to be done?"
		});
		todoInput.onInput(function(label) {
			var id = Date.now();
			all([
				todoStore.change([id, 'creation', id]),
				todoStore.change([id, 'label', label]),
				todoStore.change([id, 'done', false]),
			]).then(function() {
				todoInput.value(null);
			});
		});

/*		var activeCounter = new ActiveTodoCounter(todoStore.activeTodosCount());
		var clearCompletedBtn = new ClearCompletedButton(todoStore.completedTodosCount());
		clearCompletedBtn.onAction(function() {
			todoStore.clearCompletedTodos();
		});
*/
		// Filters

/*		var filterAllBtn = new Button("All");
		filterAllBtn.onAction(function() {
			list.content(todoStore.allTodos());
		});

		var filterActiveBtn = new Button("Active");
		filterActiveBtn.onAction(function() {
			list.content(todoStore.activeTodos());
		});

		var filterCompletedBtn = new Button("Completed");
		filterCompletedBtn.onAction(function() {
			list.content(todoStore.completedTodos());
		});
*/
		// Layout
		this._root.content([
			title,
			// new Checkbox(todoStore.checkAll()),
			todoInput,
			list,
			// activeCounter,
			// filterAllBtn,
			// filterActiveBtn,
			// filterCompletedBtn,
			// clearCompletedBtn
		]);


		// Données test
/*		todoStore.add({
			label: "My second task",
			done: false,
			creation: new Date(2)
		});
		todoStore.add({
			label: "This first task is done",
			done: true,
			creation: new Date(1)
		});
*/
		list.content(new Sorted(todoStore, 'creation', -1));
	});
});