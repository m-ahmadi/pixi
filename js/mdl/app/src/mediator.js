var util = require('./util'),
	pixi = require('./pixi-wrap'),
	core= require('./core'),
	navigation = require('./navigation'),
	inst = {};
	

inst.init = function () {
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
		
		
		
	pixi.init();
	core.init();
	navigation.init();
	
	navigation.on('zoom', function () {
		console.log('zoom');
		pixi.zoom();
	});
	navigation.on('pan', function () {
		pixi.pan.pan(1, 1);
	});
};


module.exports = inst;