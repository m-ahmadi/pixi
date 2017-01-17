//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
$('#add_device').on('click', function (e) {
	var name,
		id,
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
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@