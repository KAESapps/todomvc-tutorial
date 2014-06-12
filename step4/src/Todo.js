define([
	'compose',
	'ksf/dom/composite/_Composite',
	'ksf-ui/layout/Flow',
	'ksf-ui/widget/Label',
	'ksf-ui/widget/base/Button',
	'ksf-ui/widget/input/ShortText',
	'ksf-ui/widget/editable/Checkbox',
	'ksf/dom/style/JSS',
	'ksf/dom/style/_Stylable',
], function(
	compose,
	_Composite,
	Flow,
	Label,
	Button,
	ShortText,
	Checkbox,
	JSS,
	_Stylable
){
	var EditableLabel = compose(_Composite, _Stylable, {
		_rootFactory: function() {
			return new Flow();
		}
	}, function(rValue) {
		this._rValue = rValue;
		this._label = new Label(rValue);
		this._editor = new ShortText();
		
		var self = this;
		this.domNode.ondblclick = function() {
			self._edit();
		};
		this.domNode.onkeydown = function(ev) {
			if (ev.keyCode === 13 /* Enter */) {
				self._confirm();
			} else if (ev.keyCode === 27 /* Esc */) {
				self._cancel();
			}
		};

		this._readonly();
	}, {
		_readonly: function() {
			this._cancelBlurListener && this._cancelBlurListener();
			this._root.content([this._label]);
		},

		_edit: function() {
			this._editor.value(this._rValue.value());
			this._root.content([this._editor]);
			this._editor.focus();
			var self = this;
			this._cancelBlurListener = this._editor.onBlur(function() {
				self._confirm();
			});
		},

		_confirm: function() {
			this._rValue.value(this._editor.value());
			this._readonly();
		},

		_cancel: function() {
			this._readonly();
		}
	});

	return compose(_Composite, {
		_rootFactory: function() {
			return new Flow();			
		}
	}, function(todo) {
		var self = this;
		var label = this._label = new EditableLabel(todo.prop('label'));
		label.style(new JSS({
			display: 'inline-block',
		}));
		
		var checkbox = new Checkbox(todo.prop('done'));
		var deleteBtn = new Button("X");
		deleteBtn.onAction(function() {
			todo.delete();
		});

		this._root.content([
			checkbox,
			label,
			deleteBtn
		]);
	});
});