define([
	'ksf/utils/compose',
	'ksf/dom/composite/_Composite',
	'ksf-ui/layout/HFlex',
	'ksf-ui/widget/Label',
	'ksf-ui/widget/base/Button',
	'ksf-ui/widget/input/ShortText',
	'ksf-ui/widget/editable/Checkbox',
	'ksf/dom/style/JSS',
], function(
	compose,
	_Composite,
	HFlex,
	Label,
	Button,
	ShortText,
	Checkbox,
	JSS
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
		},
		style: function(style) {
			this._root.style(style.root);
			this._owned.label.style(style.label);
			this._owned.editor.style(style.editor);
			return this;
		}
	});

	var style = {
		root: new JSS({
			fontSize: '24px',
			position: 'relative'
		}),
		label: {
			root: new JSS({
				display: 'inline-block',
				width: 'calc(100% - 40px)',
				verticalAlign: 'middle',
				color: '#4d4d4d'
			}),
			label: new JSS({
				padding: '1ex',
				lineHeight: '1.2',
				width: '100%',
				display: 'block',
				border: '1px solid transparent',
				'-box-sizing': 'border-box',
			}),
			editor: new JSS({
				padding: '1ex',
				border: '1px solid #999',
				width: '100%',
				margin: 0,
				'-box-sizing': 'border-box',
				fontSize: 'inherit',
				color: 'inherit'
			})
		},	
		checkbox: new JSS({
			width: '40px',
			height: '40px',
			margin: 0,
			verticalAlign: 'middle',
			textAlign: 'center',
			'-w-appearance': 'none',
			outline: 'none',
			':after': {
				content: "'✔'",
				'line-height': '43px',
				'font-size': '20px',
				'color': '#d9d9d9',
				'text-shadow': '0 -1px 0 #bfbfbf',
			},
			':checked:after': {
				'color': '#85ada7',
				'text-shadow': '0 1px 0 #669991',
				'bottom': '1px',
				'position': 'relative'
			}
		}),
		deleteBtn: new JSS({
			display: 'inline-block',
			marginLeft: '-30px',
			verticalAlign: 'middle',
			color: '#a88a8a',
			fontSize: '22px',
			transition: 'all 0.2s',
			':after': {
				content: '"✖"'
			},
			':hover': {
				textShadow: '0 0 1px #000, 0 0 10px rgba(199, 107, 107, 0.8)',
				'-transform': 'scale(1.3)'
			}
		})
	};

	return compose(_Composite, {
		_rootFactory: function() {
			return new HFlex({ verticalAlign: 'middle' });			
		}
	}, function(todo) {
		this._setRoot(new HFlex({ verticalAlign: 'middle' }).style(style.root).content([
			new Checkbox(todo.prop('done')).style(style.checkbox),
			new EditableLabel(todo.prop('label')).style(style.label),
			new Button().style(style.deleteBtn).chain('onAction', function() {
				todo.delete();
			})
		]));
	});
});