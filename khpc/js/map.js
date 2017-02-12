define(['util'], function (u) {
	var inst = {},
		p;
		
	// Scope Globals:
	g = {
		renderer: {},
		stage: {},
		main: {},
		ATLAS: "images/atlas.json",
		textures: {}
	};
	
	function newNode(conf) {
		var sprite, img, scale;
		
		sprite = new PIXI.Sprite( g.textures[img] );
		sprite.interactive = true;
		sprite.buttonMode = true;
		sprite.anchor.set(0, 0);
		sprite.alpha = 1;
		sprite.scale.set( scale );
		
		return sprite;
	}
	function animate() {
		requestAnimationFrame(animate);
		g.renderer.render(g.stage);
	}
	function init(div, fn) {
		div = div instanceof jQuery ? div : u.isStr(div) ? $(div) : $(body);
		var stage, main, renderer,
			ATLAS = g.ATLAS;
		
		PIXI.utils.skipHello();
		g.renderer = PIXI.autoDetectRenderer(
			window.innerWidth,
			window.innerHeight,
			{
				backgroundColor: background || 0xAB9988, // 0xAB9999,
				antialias: true
			}
		);
		div.append( renderer.view );
		g.stage = new PIXI.Container();
		g.main = new PIXI.Container();
		stage = g.stage;
		main = g.main;
		
		stage.addChild( main );
		
		PIXI.loader.add( ATLAS );
		PIXI.loader.load(function () {
			g.textures = PIXI.loader.resources[ATLAS].textures;
			if ( u.isFn(fn) ) {
				fn();
			}
		});
		requestAnimationFrame( animate );
		renderer.render( mainContainer );
	}
	
	inst.init = init;
	inst.newNode = newNode;
	
	return inst;
});