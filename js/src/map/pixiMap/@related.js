$(window).on('resize', function () {
	var width = window.innerWidth,
		height = window.innerHeight;
	
	pixiMap.resize(width, height);
});

$(window).on('resize', function () {
	var width = window.innerWidth,
		height = window.innerHeight;
	// map.resize(width, height);
});

$('#popups').on('click', '.j-popup-close', function (e) {
	e.preventDefault();
	$(this).parent().remove();
});



//var background = new PIXI.Container();
//var tink = new Tink(PIXI, renderer.view);

// var tween = new TWEEN.Tween( graphics.position );
// tween.to( {x: 500}, 1000);
// tween.start();