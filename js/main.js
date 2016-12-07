$(function () {
	// http://192.168.10.13:2000/device/map/data?Token=1d729566c74d10037c4d&page=1&is_violated=false
	/*
	$.ajax({
		url : 'http://192.168.10.13:2000/device/map/data',
		type : 'GET',
		dataType : 'json',
		data: {
			Token: '1d729566c74d10037c4d',
			page: '1',
			is_violated: 'false'
		},
		beforeSend : function () {
			
		}
	})
	.done(function ( data, textStatus, jqXHR ) {
		a.dataBuilder.build( data );
		
		
		a.mediator.init();
	})
	.fail(function ( data, textStatus, jqXHR ) {
		
	})
	.always(function ( data, textStatus, errorThrown ) {
		
	})
	*/
	
	a.mediator.init();
	
});
//var background = new PIXI.Container();
//var tink = new Tink(PIXI, renderer.view);



// var tween = new TWEEN.Tween( graphics.position );
// tween.to( {x: 500}, 1000);
// tween.start();



$('#select_all').on('click', function (e) {
	e.preventDefault();
	var chks = $('input[type="checkbox"]');
	if (chks.length > 0) {
		chks.prop({checked: true});
	}
	
});
$('#add_device').on('click', function (e) {
	var name,
		x, y,
		type,
		links;
		
	e.preventDefault();
	
	name = $('input[type="text"][name="name"]').val();
	id = $('input[type="text"][name="id"]').val();
	x = $('input[type="text"][name="x"]').val();
	y = $('input[type="text"][name="y"]').val();
	type = $('select').find(':selected').val().trim();
	links = [];
	$('input[type="checkbox"]').each(function () {
		var id = this.id;
		if ( $(this).is(':checked')  &&  id ) {
			links.push(id);
		}
	});
	if (type) {
		$('input[type="checkbox"]').prop({checked: false});
		var finished = a.core.createTplNode({
			id: id,
			name: name,
			type: type,
			x: (x) ? x : undefined,
			y: (y) ? y : undefined,
			links: links
		});
		$('#devices').append('<label><input type="checkbox" id="'+finished+'"> '+finished+'</label>');
	}
	
	
});