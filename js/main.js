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
		type,
		links;
		
	e.preventDefault();
	
	name = $('input[type="text"][name="name"]').val();
	x = $('input[type="text"][name="x"]').val();
	y = $('input[type="text"][name="y"]').val();
	type = $('select').find(':selected').val().trim();
	links = [];
	$('input[type="checkbox"]').each(function () {
		links.push(this.name);
	});
	if (name && type) {
		$('input[type="checkbox"]').prop({checked: false});
		$('#devices').append('<label><input type="checkbox" name="'+name+'"> '+name+'</label>');
		console.log(links);
		a.core.createTplNode({
			nodeName: name, 
			type: type,
			x: (x) ? x : undefined,
			y: (y) ? y : undefined,
			links: links
		});
	}
	
	
});