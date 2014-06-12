define([
	'compose',
	'ksf-ui/widget/base/Button'
], function(
	compose,
	Button
){
	return compose(Button.prototype, function(countAccessor) {
		Button.call(this);
		this._displayCount(countAccessor.value());
		var self = this;
		countAccessor.onChange(function(value) {
			self._displayCount(value);
		});
	}, {
		_displayCount: function(count) {
			this.value("Clear completed (" + count + ")");
		}
	});
});