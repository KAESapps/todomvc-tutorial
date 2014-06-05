require({
	packages: [
		{ name: 'ksf', location: 'ksf/src' },
		{ name: 'ksf-ui', location: 'ksf-ui/src' },
	],
	map: {
		'app': {
			compose: 'ksf/utils/compose'
		}
	}

});

if (typeof document !== "undefined") {
	define(['ksf/require-config', 'ksf-ui/require-config'], function() {});
}