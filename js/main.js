$(function () {
	a.mediator.init();
	
	
	
	
	

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



$('#popups').on('click', '.popup-close', function (e) {
	e.preventDefault();
	$(this).parent().remove();
});
	
	

});