$(function () {
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
			x: x,
			y: y,
			links: links
		});
		$('#devices').append('<label><input type="checkbox" id="'+finished+'"> '+finished+'</label>');
	}
	
	
});
$('#generate').on('click', function (e) {
	e.preventDefault();
	var nodeCount = $('input[type="text"][name="nodecount"]').val(),
		density = $('input[type="text"][name="density"]').val(),
		linkColor = $('input[type="text"][name="linkcolor"]').val(),
		each = $('input[type="text"][name="each"]').val(),
		fill = $('input[type="checkbox"][name="fill"]').is(':checked');
	
	linkColor = parseInt(linkColor, 16);
	each = parseInt(each, 10);
	
	a.tpl.test(
		nodeCount || 10,
		density || 1,
		linkColor,
		each,
		fill
	);
});

$('#clear').on('click', function (e) {
	e.preventDefault();
	
	//a.pixi.clear('lineContainer', true);
	//a.pixi.clear('nodeContainer');
	
	a.pixi.clearContainer('viewport');
});

$('#sidebar').on('show.uk.offcanvas', function () {
	a.pixi.disableZoom(true);
});
$('#sidebar').on('hide.uk.offcanvas', function () {
	a.pixi.disableZoom(false);
});

$('#scan').on('click', function (e) {
	var txtarea, checkbox, txt, arr;
	
	e.preventDefault();
	
	txtarea = $('#txtarea_thing');
	checkbox = $('input[type="checkbox"][name="secure"]').is(':checked');
	
	txt = txtarea.val().trim();
	if (txt) {
		arr = txt.split("\n");
		//console.log(arr, checkbox);
		
		a.traceroute.trace(arr, checkbox);
	}
	$('#abort').removeAttr('disabled');
});

$('#abort').on('click', function (e) {
	e.preventDefault();
	a.traceroute.abort();
});

