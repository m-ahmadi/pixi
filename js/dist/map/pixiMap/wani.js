define([], function () {

	function fade(inOut, pixiEl, o) {
		o = o ? o : {};

		TweenLite.to(pixiEl, o.dur || 0.5, {
			alpha: inOut ? 1 : 0,
			yoyo: true,
			ease: Linear.easeInOut,
			onComplete: o.done,
			onCompleteParams: o.donePar,
			onCompleteScope: o.doneCtx
		});
	}
	function fadeIn(pixiEl, o) {
		fade(true, pixiEl, o);
	}
	function fadeOut(pixiEl, o) {
		fade(false, pixiEl, o);
	}
	/*
 TweenLite.to(box.scale, 0.3, {
 	x: 1,
 	y: 1,
 	yoyo: true,
 	ease: Linear.easeInOut,
 	onComplete: o.done,
 	onCompleteParams: o.doneParams,
 	onCompleteScope: o.doneCtx
 });
 */

	return {
		fadeIn: fadeIn,
		fadeOut: fadeOut
	};
});