define(["./whb"], function (whb) {
	var inst = {};

	function init(fn, par) {
		fn.apply(undefined, par);
		whb.compileAll();
	}

	inst.init = init;
	return inst;
});
//# sourceMappingURL=page.js.map