import util from './util';
import pixi from './pixi';
import tpl from './tpl';
import traceroute from './traceroute';

function onready(callback) {
	
	if ( util.isFunc(callback) ) {
		callback();
	}
	
	
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
		
		tpl.test(
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
		
		pixi.clearContainer('viewport');
	});

	$('#sidebar').on('show.uk.offcanvas', function () {
		pixi.disableZoom(true);
	});
	$('#sidebar').on('hide.uk.offcanvas', function () {
		pixi.disableZoom(false);
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
	
}


export { onready };