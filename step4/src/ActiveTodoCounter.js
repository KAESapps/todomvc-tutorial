define([
	'ksf/utils/compose',
	'ksf/dom/composite/_Composite',
	'ksf/dom/composite/_RootStylable',
	'ksf-ui/widget/base/Label',
], function(
	compose,
	_Composite,
	_RootStylable,
	Label
){
	return compose(_Composite, _RootStylable, function(countAccessor) {
		this._setRoot(new Label());
		this._displayCount(countAccessor.value());
		var self = this;
		countAccessor.onChange(function(value) {
			self._displayCount(value);
		});
	}, {
		_displayCount: function(count) {
			this._root.value(count + " item" + (count !== 1 ? "s" : "") + " left");
		}
	});
});