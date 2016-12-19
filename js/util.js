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
var util = {
	isObj: function (v) {
		return (
			v &&
			typeof v === 'object' &&
			typeof v !== null &&
			Object.prototype.toString.call(v) === '[object Object]'
		) ? true : false;
	},
	isArr: function (v) {
		if ( typeof Array.isArray === 'function' ) {
			return Array.isArray(v);
		}
		return (
			v &&
			typeof v === 'object' &&
			typeof v.length === 'number' &&
			typeof v.splice === 'function' &&
			!v.propertyIsEnumerable('length') &&
			Object.prototype.toString.call(v) === '[object Array]'
		) ? true : false;
	},
	getArgs: function (a) {
		var args = new Array(a.length),
			i;
		for (i=0; i<args.length; i+=1) {
			args[i] = a[i];
		}
		return args;
	},
	moveArrItem: function (a, f, t) { // array, from, to
		a.splice( t, 0, a.splice(f, 1)[0] );
	},
	isInt: function (n) {
		return n % 1 === 0;
	},
	negateNum: function (n) {
		return Math.abs(n) * -1;
	},
	isNumOdd: function (n) {
		return (n % 2) ? true : false;
	},
	randInt: function (min, max) { // default between 0 and 1
		min = min ? Math.ceil(min) : 0;
		max = max ? Math.floor(max) : 2;
		return Math.floor(Math.random() * (max - min)) + min;
	},
	randFloat: function (min, max) {
		min = min ? min : 0;
		max = max ? max : 1;
		return Math.random() * (max - min) + min;
	},
	isEmptyObj: function (o) {
		var k;
		if ( this.isObj(o) ) {
			if ( typeof Object.getOwnPropertyNames === 'function' ) {
				return Object.getOwnPropertyNames(o).length === 0; // ES5
			} else {
				for ( k in o ) { 
					if (  o.hasOwnProperty( k )  ) {
						return false;
					}
				}
				return true;
			}
		}
	},
	isFunc: function (v) {
		return ( typeof v === 'function' );
	},
	isStr: function (v) {
		return ( typeof v === 'string' );
	},
	isNum: function (v) {
		return ( typeof v === 'number' );
	},
	isEmptyStr: function (v) {
		return ( typeof v === 'string'  &&  v.length === 0 );
	},
	objLength: function (o) {
		if ( this.isObj(o) ) {
			return Object.keys(o).length;
		}
	},
	extend: function () {
		var args = Array.prototype.slice.call(arguments),
			len = args.length,
			arr = [],
			objects = [],
			first, last,
			result;
			
		if (len === 1) {
			first = args[0];
			if ( this.isArr(first)  &&  first.length > 1 ) {
				last = first.pop();
				objects = first;
			} else if ( this.isObj(first) ){
				result = Object.create(first);
			}
		} else if (len === 2) {
			first = args[0];
			last = args[len-1];
			if ( this.isObj(first) ) {
				result = Object.create(first);
			}
		} else if (len > 2) {
			last = args.pop();
			objects = args;
		}
		
		if (objects.length !== 0) {
			arr.push( {} );
			objects.forEach(function (el, i) {
				if ( this.isObj(el) ) {
					Object.keys(el).forEach(function (k) {
						arr[i][k] = el[k];
					});
					arr.push( Object.create(arr[i]) );
				}
			});
			result = arr[arr.length-1];
		}
		
		if ( last && this.isObj(last) ) {
			Object.keys(last).forEach(function(key) {
				result[key] = last[key];
			});
		}
		return result;
	}
};