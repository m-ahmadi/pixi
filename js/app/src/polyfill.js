if (typeof Object.create !== 'function') {
	Object.create = function (o) {
		function F() {}
		F.prototype = o;
		return new F();
	};
}
if (typeof Object.keys !== 'function') {
	Object.keys = function (o) {
		var keys = [],
			k;
		for (k in o) {
			if ( o.hasOwnProperty(k) ) {
				keys.push(k);
			}
		}
		return keys;
	};
}