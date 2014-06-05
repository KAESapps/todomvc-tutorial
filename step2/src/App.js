define([
	'compose',
	'ksf/dom/composite/_Composite',
	'ksf-ui/widget/base/Label',
	'ksf/dom/style/JSS',
], function(
	compose,
	_Composite,
	Label,
	JSS,
	Store,
	Dict,
	StatefulFactory
){
	return compose(_Composite, {
		_rootFactory: function() {
			var title = new Label("todos");
			title.style(new JSS({
				display: 'block',
				fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
				fontSize: '70px',
				fontWeight: 'bold',
				textAlign: 'center',
				color: 'rgba(255, 255, 255, 0.3)',
				textShadow: '-1px -1px rgba(0, 0, 0, 0.2)'
			}));
			return title;
		}
	});
});