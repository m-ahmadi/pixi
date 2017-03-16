define(["core/whb"], function (whb) {
	var inst = {};

	function init(fn, par) {
		fn.apply(undefined, par);
	}

	inst.init = init;
	return inst;
});
//# sourceMappingURL=page.js.map