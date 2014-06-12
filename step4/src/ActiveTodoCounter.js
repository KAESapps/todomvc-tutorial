define([
	'compose',
	'ksf-ui/widget/base/Label',
], function(
	compose,
	Label
){
	return compose(Label.prototype, function(countAccessor) {
		Label.call(this);
		this._displayCount(countAccessor.value());
		var self = this;
		countAccessor.onChange(function(value) {
			self._displayCount(value);
		});
	}, {
		_displayCount: function(count) {
			this.value(count + " item" + (count !== 1 ? "s" : "") + " left");
		}
	});
});