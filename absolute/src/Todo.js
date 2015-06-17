var compose = require('ksf/utils/compose');
var _ContentDelegate = require('absolute/_ContentDelegate');
var Label = require('absolute/Label');
var Background = require('absolute/Background');
var HFlex = require('absolute/HFlex');
var Align = require('absolute/Align');
var Mousable = require('absolute/Mousable');
var Margin = require('absolute/Margin');
var LabelInput = require('absolute/LabelInput');
var Switch = require('absolute/Switch');
var Checkbox = require('./Checkbox');
var uiVars = require('./uiVars');

module.exports = compose(_ContentDelegate, function(todoNode) {
	this._dataNode = todoNode;

	this._content = new Background(new HFlex([
		[new Align(new Mousable(this._checkbox = new Checkbox()).width(40).height(40).on('click', function() {
			this._dataNode.change('done', !this._checkbox.checked());
		}.bind(this)), 'middle', 'middle').width(50), 'fixed'],
		this._labelArea = new Switch(),
	])).color('white').height(50);

	this._readOnlyLabel = new Mousable(new Margin(this._label = new Label().font({ family: uiVars.font, size: '24px' }), { left: 10 })).on('dblclick', function() {
		this._edit(true);
	}.bind(this));
	this._input = new LabelInput().style({ border: 'none', fontFamily: uiVars.font, fontSize: '24px', padding: '0 10px' })
		.onFocus(function(focused) {
			if (!focused) {
				this._commitLabel();
			}
		}.bind(this))
		.onKeyDown(function(ev) {
			if (ev.keyCode === 13 /* ENTER */) {
				this._commitLabel();
			} else if (ev.keyCode === 27 /* ESC */) {
				this._edit(false);
			}
		}.bind(this));

	this._label.value(todoNode.value().label);
	this._checked(todoNode.value().done);

	todoNode.onChange(function(change) {
		if (change.key === 'label') {
			this._label.value(change.value);
		}
		if (change.key === 'done') {
			this._checked(change.value);
		}
	}.bind(this));

	this._edit(false);
}, {
	_commitLabel: function() {
		this._dataNode.change('label', this._input.value());
		this._edit(false);
	},
	_edit: function(edit) {
		if (edit) {
			this._labelArea.content(this._input);
			this._input.value(this._dataNode.value().label);
			this._input.focus(true);
		} else {
			this._labelArea.content(this._readOnlyLabel);
		}
	},
	_checked: function(checked) {
		this._checkbox.checked(checked);
		this._label.color(checked ? '#d9d9d9' : 'black');
		this._label.textDecoration(checked ? 'line-through' : 'none');
		return this;
	}
});