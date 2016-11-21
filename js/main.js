$(function () {
	a.pixi.init();
	a.core.init();
	
});
//var background = new PIXI.Container();
//var tink = new Tink(PIXI, renderer.view);

$(document).on('mousewheel', function (e) {
	// e.deltaX, e.deltaY, e.deltaFactor
	
	var	stage = a.pixi.stage;
	
	if (e.deltaY < 0) {
		console.log( 'Zoom out...');
		stage.scale.set( stage.scale.x -= 0.05  );
		stage.scale.set( stage.scale.y -= 0.05  );
	} else {
		console.log( 'Zoom in..' );
		stage.scale.set( stage.scale.x += 0.05  );
		stage.scale.set( stage.scale.y += 0.05  );
	}
	
});


// var tween = new TWEEN.Tween( graphics.position );
// tween.to( {x: 500}, 1000);
// tween.start();


$('#add_device').on('click', function (e) {
	var name,
		x, y,
		type;
		
	e.preventDefault();
	
	name = $('input[type="text"][name="name"]').val();
	x = $('input[type="text"][name="x"]').val();
	y = $('input[type="text"][name="y"]').val();
	type = $('select').find(':selected').val();
	
	if (name && x && y && type) {
		$('#devices').append('<label><input type="checkbox"> '+name+'</label>');
	}
	
	
});