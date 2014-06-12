define([
	'compose',
	'ksf/dom/composite/_Composite',
	'ksf-ui/widget/base/Label',
	'ksf-ui/widget/Label',
	'ksf-ui/widget/base/Button',
	'ksf-ui/widget/input/ShortText',
	'ksf-ui/widget/editable/Checkbox',
	'ksf-ui/layout/Flow',
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
	Flow,
	ItemList,
	Todo,
	Model,
	JSS
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

	return compose(_Composite, {
		_rootFactory: function() {
			return new Flow();
		}
	}, function() {
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

		var todoInput = new ShortTextInput({
			placeholder: "What needs to be done?"
		});
		todoInput.onInput(function(label) {
			todoStore.add({
				label: label,
				done: false,
				creation: new Date()
			});
			todoInput.value(null);
		});

		var activeCounter = new ActiveTodoCounter(activeTodos.count());
		var clearCompletedBtn = new ClearCompletedButton(completedTodos.count());
		clearCompletedBtn.onAction(function() {
			var changeArg = {};
			Object.keys(completedTodos._getValue()).forEach(function(key) {
				changeArg[key] = { remove: true };
			});
			todoStore._change(changeArg);
		});

		// Filters

		var filterAllBtn = new Button("All");
		filterAllBtn.onAction(function() {
			list.content(sortStore(todoStore));
		});

		var filterActiveBtn = new Button("Active");
		filterActiveBtn.onAction(function() {
			list.content(sortStore(activeTodos));
		});

		var filterCompletedBtn = new Button("Completed");
		filterCompletedBtn.onAction(function() {
			list.content(sortStore(completedTodos));
		});

		// check-all
		var checkAll = new Checkbox(new CheckAllAccessor(todoStore));

		// Layout
		this._root.content([
			title,
			checkAll,
			todoInput,
			list,
			activeCounter,
			filterAllBtn,
			filterActiveBtn,
			filterCompletedBtn,
			clearCompletedBtn
		]);


		// Données test
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

		list.content(sortedStore);
	});
});