define([
	'ksf/utils/compose',
	'ksf/dom/composite/_Composite',
	'ksf-ui/layout/HFlex',
	'ksf-ui/widget/Label',
	'ksf-ui/widget/base/Button',
	'ksf-ui/widget/input/ShortText',
	'ksf-ui/widget/editable/Checkbox',
], function(
	compose,
	_Composite,
	HFlex,
	Label,
	Button,
	ShortText,
	Checkbox
){
	var EditableLabel = compose(_Composite, {
		_rootFactory: function() {
			return new HFlex();
		}
	}, function(rValue) {
		this._rValue = rValue;
		this._own(new Label(rValue), 'label');
		this._own(new ShortText(), 'editor');
		
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
			this._root.content([this._owned.label]);
		},

		_edit: function() {
			this._owned.editor.value(this._rValue.value());
			this._root.content([this._owned.editor]);
			this._owned.editor.focus();
			var self = this;
			this._cancelBlurListener = this._owned.editor.onBlur(function() {
				self._confirm();
			});
		},

		_confirm: function() {
			this._rValue.value(this._owned.editor.value());
			this._readonly();
		},

		_cancel: function() {
			this._readonly();
		}
	});

	return compose(_Composite, function(todo) {
		this._setRoot(new HFlex().content([
			new Checkbox(todo.prop('done')),
			new EditableLabel(todo.prop('label')),
			new Button("X").chain('onAction', function() {
				todo.delete();
			})
		]));
	});
});