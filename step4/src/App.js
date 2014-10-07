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
	VFlex,
	HFlex,
	ItemList,
	Todo,
	TodoStore,
	JSS,
	ActiveTodoCounter,
	ClearCompletedButton,
	CheckAllAccessor
){
	var style = {
		root: new JSS({
			fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
			'width': '550px',
			margin: 'auto',
		}),
		main: new JSS({
			background: 'white'
		}),
		title: new JSS({
			display: 'block',
			fontSize: '70px',
			fontWeight: 'bold',
			textAlign: 'center',
			color: 'rgba(255, 255, 255, 0.3)',
			textShadow: '-1px -1px rgba(0, 0, 0, 0.2)',
		}),
		checkAll: new JSS({
			width: '40px',
			height: '40px',
			margin: 0,
			textAlign: 'center',
			'-w-appearance': 'none',
			'-webkit-transform': 'rotate(90deg)',
			outline: 'none',
			':after': {
				content: "'»'",
				'font-size': '28px',
				'color': '#d9d9d9',
			},
			':checked:after': {
				'color': '#737373'
			}
		}),
		todoInput: new JSS({
			'padding': '16px',
			'border': 'none',
			background: 'none',
			'position': 'relative',
			'margin': '0',
			'width': 'calc(100% - 40px)',
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
		}),
		header: new JSS({
			background: 'rgba(0, 0, 0, 0.02)',
		}),
		footer: new JSS({
			position: 'relative',
			height: '50px',
			lineHeight: '50px',
			padding: '0 10px',
			color: 'gray',
			':before': {
				'content': "''",
				'position': 'absolute',
				'right': '0',
				'bottom': '50px',
				'left': '0',
				'height': '55px',
				'z-index': '-1',
				'box-shadow': '0 1px 1px rgba(0, 0, 0, 0.3), 0 6px 0 -3px rgba(255, 255, 255, 0.8), 0 7px 1px -3px rgba(0, 0, 0, 0.3), 0 43px 0 -6px rgba(255, 255, 255, 0.8), 0 44px 2px -6px rgba(0, 0, 0, 0.2)',
			}
		}),
		footerButton: new JSS({
			padding: '0 10px',
			cursor: 'pointer'
		})
	};


	function sortStore(store) {
		// sort todos by creation timestamp, oldest first
		return store.sort(function(a, b) {
			return a.creation - b.creation;
		});
	}

	return compose(_Composite, function() {
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

		// Layout
		this._setRoot(new VFlex().style(style.root).content([
			new Label("todos").style(style.title),
			new VFlex().style(style.main).content([
				new HFlex({ verticalAlign: 'middle' }).style(style.header).content([
					new Checkbox(new CheckAllAccessor(todoStore)).style(style.checkAll),
					this._own(new ShortTextInput({
						placeholder: "What needs to be done?"
					}), 'todoInput').style(style.todoInput),
				]),
				this._own(compose.create(ItemList, {
					_itemFactory: function(todo) {
						return new Todo(todo);
					}
				}), 'list'),
			]),
			new HFlex().style(style.footer).content([
				[new ActiveTodoCounter(activeTodos.count()), { flex: true }],
				this._own(new Button("All"), 'filterAllBtn').style(style.footerButton),
				this._own(new Button("Active"), 'filterActiveBtn').style(style.footerButton),
				this._own(new Button("Completed"), 'filterCompletedBtn').style(style.footerButton),
				this._own(new ClearCompletedButton(completedTodos.count()), 'clearCompletedBtn').style(style.footerButton),
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

		this._owned.filterAllBtn.onAction(function() {
			self._displayAll();
		});

		this._owned.filterActiveBtn.onAction(function() {
			self._displayActive();
		});

		this._owned.filterCompletedBtn.onAction(function() {
			self._displayCompleted();
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
			this._owned.list.content(sortStore(this._allTodos));
		},
		_displayActive: function() {
			this._owned.list.content(sortStore(this._activeTodos));
		},
		_displayCompleted: function() {
			this._owned.list.content(sortStore(this._completedTodos));
		}
	});
});