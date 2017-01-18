var inst = {};

function define(callback) {
	$(callback);
}
//var background = new PIXI.Container();
//var tink = new Tink(PIXI, renderer.view);



// var tween = new TWEEN.Tween( graphics.position );
// tween.to( {x: 500}, 1000);
// tween.start();


function defineOther() {
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
};

inst.define = define;
inst.defineOther = defineOther;

module.exports = inst;