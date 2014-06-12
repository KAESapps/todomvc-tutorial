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
	'./TodoStore',
	'ksf/dom/style/JSS',
	'./ActiveTodoCounter',
	'./ClearCompletedButton',
	'./CheckAllAccessor'
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
	TodoStore,
	JSS,
	ActiveTodoCounter,
	ClearCompletedButton,
	CheckAllAccessor
){
	var styles = {
		root: new JSS({
			fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
			'width': '550px',
			margin: 'auto',
		}),
		title: new JSS({
			display: 'block',
			fontSize: '70px',
			fontWeight: 'bold',
			textAlign: 'center',
			color: 'rgba(255, 255, 255, 0.3)',
			textShadow: '-1px -1px rgba(0, 0, 0, 0.2)',
		}),
		todoInput: new JSS({
			'padding': '16px 16px 16px 60px',
			'border': 'none',
			background: 'rgba(0, 0, 0, 0.02)',
			'position': 'relative',
			'margin': '0',
			'width': 'calc(100% - 20px)',
			'font-size': '24px',
			'font-family': 'inherit',
			'line-height': '1.4em',
			'outline': 'none',
			'color': 'inherit',
			'-box-sizing': 'border-box',
			'-font-smoothing': 'antialiased',
			'::-webkit-input-placeholder': {
				fontStyle: 'italic'
			},
			'::-moz-placeholder': {
				'%%fontStyle': 'italic',	// '%%'' is a hack to force AbsurdJS to not merge this property with the -webkit one, otherwise it gets ignored
				color: '#a9a9a9'
			}
		})
	};


	function sortStore(store) {
		// sort todos by creation timestamp, oldest first
		return store.sort(function(a, b) {
			return a.creation - b.creation;
		});
	}

	return compose(_Composite, {
		_rootFactory: function() {
			return new Flow().style(styles.root);
		}
	}, function() {
		var self = this;

		// create store of all todos
		var todoStore = this._allTodos = new TodoStore();
		// filter active todos
		var activeTodos = this._activeTodos = todoStore.filter(function(todo) {
			return !todo.done;
		});
		// filter completed todos
		var completedTodos = this._completedTodos = todoStore.filter(function(todo) {
			return todo.done;
		});

		var title = new Label("todos").style(styles.title);

		var list = this._list = compose.create(ItemList, {
			_itemFactory: function(todo) {
				return new Todo(todo);
			}
		});

		var todoInput = new ShortTextInput({
			placeholder: "What needs to be done?"
		}).style(styles.todoInput);
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
			self._displayAll();
		});

		var filterActiveBtn = new Button("Active");
		filterActiveBtn.onAction(function() {
			self._displayActive();
		});

		var filterCompletedBtn = new Button("Completed");
		filterCompletedBtn.onAction(function() {
			self._displayCompleted();
		});

		var checkAll = new Checkbox(new CheckAllAccessor(todoStore));

		// Layout
		this._root.content([
			title,
			new Flow([
				new Flow([
					checkAll,
					todoInput,
				]),
				list,
				activeCounter,
				filterAllBtn,
				filterActiveBtn,
				filterCompletedBtn,
				clearCompletedBtn
			]).style(new JSS({ background: 'white' })),
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


		// display all todos on start
		this._displayAll();
	}, {
		_displayAll: function() {
			this._list.content(sortStore(this._allTodos));
		},
		_displayActive: function() {
			this._list.content(sortStore(this._activeTodos));
		},
		_displayCompleted: function() {
			this._list.content(sortStore(this._completedTodos));
		}
	});
});