var InputHeader = require('../InputHeader');
var DeepStore = require('ksf/observable/deep/Store');
var DeepBranch = require('ksf/observable/deep/Branch');

var allChecked = {
	_value: false,
	value: function() {
		return this._value;
	},
	change: function(value) {
		this._value = value;
		this._cb && this._cb(value);
	},
	onChange: function(cb) {
		this._cb = cb;
	}
};

var inputHeader = new InputHeader(new DeepBranch(new DeepStore(), ''), allChecked);

inputHeader.width(400).left(10).top(10).containerVisible(true).parentNode(document.body);
document.body.style.background= 'lightgray';