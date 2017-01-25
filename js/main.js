$(function () {
	a.mediator.init();
	
	$('#newSide').css({height: window.innerHeight});
	$('#newSide').toggle('slide');
	
	

//var background = new PIXI.Container();
//var tink = new Tink(PIXI, renderer.view);



// var tween = new TWEEN.Tween( graphics.position );
// tween.to( {x: 500}, 1000);
// tween.start();





$('#clear').on('click', function (e) {
	e.preventDefault();
	
	//a.pixi.clear('lineContainer', true);
	//a.pixi.clear('nodeContainer');
	
	a.pixi.clearContainer('viewport');
});



$('#sidebar-btn').on('click', function () {
	this.closed = this.closed ? false : true;
	var sb = $('#newSide');
	
	
	if (  !sb.is(':animated')  ) {
		sb.toggle('slide');
	}
	
	// if (this.closed) {
		// sb.toggleClass('uk-animation-slide-left');
		// sb.toggleClass('no-display');
	// } else {
		// sb.addClass('uk-animation-reverse');
		
	// }
});

$('#traceroute-scan').on('click', function (e) {
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

$('#discovery-start').on('click', function () {
	var first, second, type;
	
	first = $('input[type="text"][name="first-input"]').val();
	second = $('input[type="text"][name="second-input"]').val();
	
	first = first ? first.trim() : '';
	second = second ? second.trim() : '';
	
	type = $('#modal-discovery input[type="radio"][name="radio1"]:checked').val();
	a.discovery.discover( first, second, parseInt(type, 10) );
	
});
$('#modal-discovery input[type="radio"][name="radio1"].uk-radio').on('click', function () {
	var val = parseInt(this.value, 10),
		first, second;
		
	first = $('input[type="text"][name="first-input"]');
	second = $('input[type="text"][name="second-input"]');
	
	if (!val) {
		first.val('192.168.1.1');
		second.val('192.168.1.255');
	} else {
		first.val('192.168.1.1');
		second.val('255.255.255.0');
	}
});

$('#popups').on('click', '.j-popup-close', function (e) {
	e.preventDefault();
	$(this).parent().remove();
});




});