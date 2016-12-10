var define = (function () {
	var	modules = {},
		count = 0;
	
	function uid() {
		return 'module_'+(count+=1);
	}
	function getDeps(strArr) {
		var arr = [];
		strArr.forEach(function (i) {
			var module = modules[i];
			if ( util.isObj(module) ) {
				arr.push( modules[i] );
			} else {
				throw new ReferenceError('Dependency: '+i+' is not defined.');
			}
		});
		return arr;
	}
	function create(name, deps, def) {
		modules[name] = def.apply(undefined, deps);
	}
	function one(a) {
		var name,
			deps;
		if ( util.isFunc(a) ) {
			name = uid();
			deps = [];
			create(name, deps, a);
		}
	}
	function two(a, b) {
		var deps = [];
		if ( util.isFunc(b) ) {
			if (a) {
				if ( util.isStr(a) ) {
					name = a;
				} else if ( util.isArr(a)  &&  a.length ) {
					name = uid();
					deps = getDeps(a);
				}
			} else {
				name = uid();
			}
			create(name, deps, b);
		}
	}
	function three(a, b, c) {
		var name,
			deps = [];
		if ( util.isFunc(c) ) {
			name = util.isStr(a) ? a: uid();
			if ( util.isArr(b)  &&  b.length ) {
				deps = getDeps(b);
			}
			create(name, deps, c);
		}
	}
	function define(a, b, c) {
		var length = util.getArgs(arguments).length;
		if ( !length ) {
			return;
		} else if ( length === 1 ) {
			one(a);
		} else if  ( length === 2 ) {
			two(a, b);
		} else if ( length === 3 ) {
			three(a, b, c);
		}
	}
	
	Object.defineProperty(define, 'modules', {
		get: function () {
			return modules;
		}
	});
	return define;
}());