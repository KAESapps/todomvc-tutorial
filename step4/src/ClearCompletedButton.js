define([
	'ksf/utils/compose',
	'ksf/dom/composite/_Composite',
	'ksf/dom/composite/_RootStylable',
	'ksf-ui/widget/base/Button'
], function(
	compose,
	_Composite,
	_RootStylable,
	Button
){
	return compose(_Composite, _RootStylable, function(countAccessor) {
		this._setRoot(new Button(this));
		this._displayCount(countAccessor.value());
		var self = this;
		countAccessor.onChange(function(value) {
			self._displayCount(value);
		});
	}, {
		_displayCount: function(count) {
			this._root.value("Clear completed (" + count + ")");
		},
		onAction: function(cb) {
			return this._root.onAction(cb);
		}
	});
});