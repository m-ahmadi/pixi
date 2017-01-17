import * as $ from 'jquery';
import wpix from '../wpix';
import traceroute from '../traceroute';
import mediator from '../mediator';




$(function () {
	mediator.init();
	
	
	
	
	

//var background = new wpix.Container();
//var tink = new Tink(wpix, renderer.view);



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



$('#clear').on('click', function (e) {
	e.preventDefault();
	
	//a.wpix.clear('lineContainer', true);
	//a.wpix.clear('nodeContainer');
	
	wpix.clearContainer('viewport');
});

$('#sidebar').on('show.uk.offcanvas', function () {
	wpix.disableZoom(true);
});
$('#sidebar').on('hide.uk.offcanvas', function () {
	wpix.disableZoom(false);
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
		
		traceroute.trace(arr, checkbox);
	}
	$('#abort').removeAttr('disabled');
});

$('#abort').on('click', function (e) {
	e.preventDefault();
	traceroute.abort();
});

});