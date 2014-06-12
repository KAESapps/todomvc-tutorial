define([
	'ksf-ui/utils/Init',
	'ksf/dom/style/JSS',
	'./App',
	'require',
	'ksf/model/PouchDb',
	'ksf/model/TuppleStore',
	'ksf/model/Cache',
], function(
	Init,
	JSS,
	App,
	require,
	PouchDb,
	Tupple,
	Cache
){
	new JSS({
		background: "#eaeaea url('" + require.toUrl('todomvc-common/bg.png') + "')"
	}).apply(document.body);


	var db = window.db = new PouchDb('todomvc');
	var tuppleStore = new Tupple(db);
	var store = window.store = new Cache(tuppleStore);

	store.ready.then(function() {
		db.startSync('https://kaes.iriscouch.com:6984/todomvc');
		new Init(new App(store));
	});

});