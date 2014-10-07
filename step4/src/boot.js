define([
	'ksf-ui/utils/Init',
	'ksf/dom/style/JSS',
	'./App'
], function(
	Init,
	JSS,
	App
){
	new JSS({
		background: "#eaeaea url('./bg.png')"
	}).apply(document.body);
	
	new Init(new App().bounds({}));
});