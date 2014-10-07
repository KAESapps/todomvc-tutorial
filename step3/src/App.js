define([
	'ksf/utils/compose',
	'ksf/dom/composite/_Composite',
	'ksf-ui/widget/base/Label',
	'ksf-ui/widget/Label',
	'ksf-ui/widget/base/Button',
	'ksf-ui/widget/input/ShortText',
	'ksf-ui/widget/editable/Checkbox',
	'ksf-ui/layout/VFlex',
	'ksf-ui/layout/HFlex',
	'ksf-ui/list/ItemList',
	'./Todo',
	'./Model',
	'ksf/dom/style/JSS',
], function(
	compose,
	_Composite,
	Label,
	RLabel,
	Button,
	ShortTextInput,
	Checkbox,
	VFlex,
	HFlex,
	ItemList,
	Todo,
	Model,
	JSS
){
	var ActiveTodoCounter = compose(_Composite, function(countAccessor) {
		this._setRoot(new Label());
		this._displayCount(countAccessor.value());
		var self = this;
		countAccessor.onChange(function(value) {
			self._displayCount(value);
		});
	}, {
		_displayCount: function(count) {
			this._root.value(count + " item" + (count !== 1 ? "s" : "") + " left");
		}
	});

	var ClearCompletedButton = compose(_Composite, function(countAccessor) {
		this._setRoot(new Button(this));
		this._displayCount(countAccessor.value());
		var self = this;
		countAccessor.onChange(function(value) {
			self._displayCount(value);
		});
	}, {
		_displayCount: function(count) {
			this._root.value("Clear completed (" + count + ")");
		},
		onAction: function(cb) {
			return this._root.onAction(cb);
		}
	});

	var sortStore = function(store) {
		return store.sort(function(a, b) {
			return a.creation - b.creation;
		});
	};

	var CheckAllAccessor = compose(function(source) {
		this._source = source;
	}, {
		onChange: function(cb) {
			var self = this;
			return this._source.onChange(function(value) {
				var sourceValue = self._source._getValue();
				var keys = Object.keys(sourceValue);
				cb(keys.length && keys.every(function(key) {
					var todo = sourceValue[key];
					return todo.done;
				}));
			});
		},
		value: function(value) {
			var sourceValue = this._source._getValue(),
				changeArg = {};
			Object.keys(sourceValue).forEach(function(key) {
				changeArg[key] = { change: {
					done: {
						value: value
					}
				}};
			});
			return this._source._change(changeArg);
		}
	});

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
		// model
		var todoStore = new Model();
		// list todos sorted by creation timestamp, oldest first
		var sortedStore = sortStore(todoStore);
		// filter active todos
		var activeTodos = todoStore.filter(function(todo) {
			return !todo.done;
		});
		// filter completed todos
		var completedTodos = todoStore.filter(function(todo) {
			return todo.done;
		});

		// Layout
		this._setRoot(new VFlex().content([
			new Label("todos").style(style.title),
			new HFlex().content([
				new Checkbox(new CheckAllAccessor(todoStore)),
				this._own(new ShortTextInput({
					placeholder: "What needs to be done?"
				}), 'todoInput'),
			]),
			this._own(compose.create(ItemList, {
				_itemFactory: function(todo) {
					return new Todo(todo);
				}
			}), 'list'),
			new HFlex().content([
				new ActiveTodoCounter(activeTodos.count()),
				this._own(new Button("All"), 'filterAllBtn'),
				this._own(new Button("Active"), 'filterActiveBtn'),
				this._own(new Button("Completed"), 'filterCompletedBtn'),
				this._own(new ClearCompletedButton(completedTodos.count()), 'clearCompletedBtn'),
			])
		]));

		// add here all listeners for events coming from subcomponents
		// we might have chained them with .chain() method, but with many components, it can become illegible.

		// add a todo "on input" from text box
		var todoInput = this._owned.todoInput;
		todoInput.onInput(function(label) {
			todoStore.add({
				label: label,
				done: false,
				creation: new Date()
			});
			todoInput.value(null);
		});

		// swap list content with matching todo stores
		var list = this._owned.list;
		this._owned.filterAllBtn.onAction(function() {
			list.content(sortStore(todoStore));
		});
		this._owned.filterActiveBtn.onAction(function() {
			list.content(sortStore(activeTodos));
		});
		this._owned.filterCompletedBtn.onAction(function() {
			list.content(sortStore(completedTodos));
		});

		// bulk remove completed todos
		// TODO: cleaner API
		this._owned.clearCompletedBtn.onAction(function() {
			var changeArg = {};
			Object.keys(completedTodos._getValue()).forEach(function(key) {
				changeArg[key] = { remove: true };
			});
			todoStore._change(changeArg);
		});


		// test data
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

		this._owned.list.content(sortedStore);
	});
});