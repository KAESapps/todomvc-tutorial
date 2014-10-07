define([
	'ksf/utils/compose'
], function(
	compose
){
	return compose(function(source) {
		this._source = source;
	}, {
		onChange: function(cb) {
			var self = this;
			return this._source.onChange(function(value) {
				var sourceValue = self._source._getValue();
				var keys = Object.keys(sourceValue);
				cb(keys.length && keys.every(function(key) {
					var todo = sourceValue[key];
					return todo.done;
				}));
			});
		},
		value: function(value) {
			var sourceValue = this._source._getValue(),
				changeArg = {};
			Object.keys(sourceValue).forEach(function(key) {
				changeArg[key] = { change: {
					done: {
						value: value
					}
				}};
			});
			return this._source._change(changeArg);
		}
	});
});