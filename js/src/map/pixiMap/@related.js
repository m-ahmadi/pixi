$(window).on('resize', function () {
	var width = window.innerWidth,
		height = window.innerHeight;
	
	pixiMap.resize(width, height);
});