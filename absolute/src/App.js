var compose = require('ksf/utils/compose');
var _ContentDelegate = require('absolute/_ContentDelegate');
var VPile = require('absolute/VPile');
var HFlex = require('absolute/HFlex');
var Reactive = require('absolute/Reactive');
var Label = require('absolute/Label');
var InputHeader = require('./InputHeader');
var Todo = require('./Todo');
var DeepBranch = require('ksf/observable/deep/Branch');
var DeepOrderedBranch = require('ksf/observable/deep/OrderedBranch');
var MappedValue = require('ksf/observable/MappedValue');
var OrderedList = require('absolute/deep/OrderedBranch');
var nativeCompare = require('ksf/utils/nativeCompare');
var _Evented = require('ksf/base/_Evented');

var LeftTodosCounter = compose(_Evented, function(todoTree) {
	var treeValue = todoTree.value();
	this._value = Object.keys(todoTree.keys()).filter(function(key) {
		return !treeValue[key + '/done'];
	}).length;

	todoTree.onChange(function(change) {
		if (change.key.split('/')[1] === 'done') {
			this._value += change.value ? -1 : 1;
			this._emit('change', this._value);
		}
	}.bind(this));
}, {
	value: function() {
		return this._value;
	},
	onChange: function(cb) {
		this._on('change', cb);
	}
});

module.exports = compose(_ContentDelegate, function(todoStore) {
	var todos = new DeepBranch(todoStore, '');
	var sortedTodos = new DeepOrderedBranch(todoStore, '', 'created', nativeCompare);

	var leftTodosCounter = new LeftTodosCounter(todos);

	this._content = new VPile().content([
		this._input = new InputHeader(todos, leftTodosCounter).onInput(function(label) {
			var key = todoStore.addKey();
			todoStore.change(key + '/label', label);
			todoStore.change(key + '/created', Date.now());
			this._input.clear();
		}.bind(this)),
		new OrderedList({
			content: new VPile(),
			value: sortedTodos,
			onKeyAdded: function(pile, key, beforeKey) {
				pile.add(key, new Todo(new DeepBranch(sortedTodos, key)), beforeKey);
			},
			onKeyMoved: function(pile, key, beforeKey) {
				pile.move(key, beforeKey);
			},
			onKeyRemoved: function(pile, key) {
				pile.remove(key);
			}
		}),
		new HFlex([
			new Reactive({
				value: new MappedValue(leftTodosCounter, function(count) {
					if (count === 1) {
						return "1 item left";
					} else {
						return count + " items left";
					}
				}),
				content: new Label()
			})
		])
	]);
});