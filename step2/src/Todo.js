define([
	'ksf/utils/compose',
	'ksf/dom/composite/_Composite',
	'ksf-ui/layout/HFlex',
	'ksf-ui/widget/Label',
	'ksf-ui/widget/editable/Checkbox',
	'ksf/dom/style/JSS',
], function(
	compose,
	_Composite,
	HFlex,
	Label,
	Checkbox,
	JSS
){
	return compose(_Composite, function(todo) {
		this._setRoot(new HFlex().content([
			new Checkbox(todo.prop('done')),
			new Label(todo.prop('label')),
		]));
	});
});