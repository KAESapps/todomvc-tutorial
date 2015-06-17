/*jshint multistr: true */
var compose = require('ksf/utils/compose');
var _Evented = require('ksf/base/_Evented');
var MappedValue = require('ksf/observable/MappedValue');
var _ContentDelegate = require('absolute/_ContentDelegate');
var Label = require('absolute/Label');
var Background = require('absolute/Background');
var HFlex = require('absolute/HFlex');
var Align = require('absolute/Align');
var Mousable = require('absolute/Mousable');
var Margin = require('absolute/Margin');
var LabelInput = require('absolute/LabelInput');
var Switch = require('absolute/Switch');
var SvgIcon = require('absolute/SvgIcon');
var uiVars = require('./uiVars');
var Style = require('ksf/dom/style/Style');

var toggleAllIcon = {
	width: 11,
	height: 6,
	data: 'M 0,0 0,2.4375 5.5,6 11,2.4375 11,0 5.5,3.625 0,0 z'
};

var placeholderStyle = 'font-style: italic; color: #e6e6e6;';
// we inject CSS rules in order to use pseudo-selectors
var placeholderStyleCss = new Style(
'	#this::-webkit-input-placeholder { ' + placeholderStyle + ' } \
	#this::-moz-placeholder { ' + placeholderStyle + ' } \
	#this::input-placeholder { ' + placeholderStyle + ' }'
);

module.exports = compose(_ContentDelegate, _Evented, function(todoTree, leftTodosCounter) {
	var allChecked = new MappedValue(leftTodosCounter, function(leftCount) {
		return !leftCount;
	});

	this._content = new Background(new HFlex([
		[new Align(new Mousable(this._toggleAllIcon = new SvgIcon(toggleAllIcon)).width(20).height(15).on('click', function() {
			var checkedState = !allChecked.value();
			// (un)check all
			Object.keys(todoTree.keys()).forEach(function(key) {
				if (todoTree.value()[key + '/done'] !== checkedState) {
					todoTree.change(key + '/done', checkedState);
				}
			});
		}.bind(this)), 'middle', 'middle').width(50), 'fixed'],
		this._input = new LabelInput().placeholder("What needs to be done?").style({ border: 'none', fontFamily: uiVars.font, fontSize: '24px', padding: '0 10px' })
			.onKeyDown(function(ev) {
				if (ev.keyCode === 13 /* ENTER */) {
					this._validate();
				}
			}.bind(this)),
	])).color('white').height(50);

	placeholderStyleCss.apply(this._input._content.domNode);

	this._setAllChecked(allChecked.value());

	allChecked.onChange(function(value) {
		this._setAllChecked(value);
	}.bind(this));
}, {
	_validate: function() {
		var inputValue = this._input.value();
		if (inputValue) {
			this._emit('input', inputValue);
		}
	},
	_setAllChecked: function(allChecked) {
		this._toggleAllIcon.color(allChecked ? '#737373' : '#e6e6e6');
	},
	onInput: function(cb) {
		this._on('input', cb);
		return this;
	},
	clear: function() {
		this._input.value("");
	}
});