define([
	'ksf/observable/model/Store',
	'ksf/observable/model/Dict',
	'ksf/observable/StatefulWithLogicFactory'
], function(
	Store,
	Dict,
	StatefulFactory
){
	return new StatefulFactory(new Store(new Dict())).ctr;
});