define([
	'compose',
	'ksf/dom/composite/_Composite',
	'ksf-ui/layout/Flow',
	'ksf-ui/widget/Label',
	'ksf-ui/widget/editable/Checkbox',
	'ksf/dom/style/JSS',
], function(
	compose,
	_Composite,
	Flow,
	Label,
	Checkbox,
	JSS
){
	return compose(_Composite, {
		_rootFactory: function() {
			return new Flow();			
		}
	}, function(todo) {
		var label = new Label(todo.prop('label'));
		label.style(new JSS({
			display: 'inline-block',
		}));

		var checkbox = new Checkbox(todo.prop('done'));

		this._root.content([
			checkbox,
			label,
		]);
	});
});