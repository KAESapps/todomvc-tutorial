define([
	'ksf-ui/utils/Init',
	'ksf/dom/style/JSS',
	'./App',
	'require'
], function(
	Init,
	JSS,
	App,
	require
){
	new JSS({
		background: "#eaeaea url('" + require.toUrl('todomvc-common/bg.png') + "')"
	}).apply(document.body);
	
	new Init(new App());
});