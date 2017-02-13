define(['lib/pixi.min', 'util'], function (PIXI, u) {
	var inst = {},
		p;
		
	// Scope Globals:
	g = {
		renderer: {},
		stage: {},
		main: {},
		ATLAS_PATH: "images/atlas.json",
		BG_PATH: "images/bg.png",
		textures: {}
	};
	
	function animate() {
		requestAnimationFrame(animate);
		g.renderer.render(g.stage);
	}
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
	
	
	function dragStart(e) {
		t = this;
		console.log(this);
		this.data = e.data;
		this.alpha = 0.5;
		this.dragging = true;
		this.dragPoint = e.data.getLocalPosition(this.parent);
		this.dragPoint.x -= this.position.x;
		this.dragPoint.y -= this.position.y;
		
		//bringToFront(this);
	}
	function dragMove(e) {
		if (this.dragging) {
			var newPosition = this.data.getLocalPosition(this.parent);
			this.position.x = newPosition.x - this.dragPoint.x;
			this.position.y = newPosition.y - this.dragPoint.y;
		}
	}
	function dragEnd() {
		this.alpha = 1;
		this.dragging = false;
		this.data = null;
	}
	
	function start() {
		var tile = new PIXI.extras.TilingSprite.fromImage(g.BG_PATH, window.innerWidth, window.innerHeight);
		g.main.addChild(tile);
		
		
		// var s = new PIXI.Sprite.fromImage( "images/1.png");
		var i;
		var s;
		for (i=0; i<9; i+=1) {
			s = new PIXI.Sprite( g.textures[i+".png"] );
			s.interactive = true;
			
			s.scale.set(1);
			s.mousedown = dragStart;
			s.mouseup = dragEnd;
			s.mouseupoutside = dragEnd;
			s.mousemove = dragMove;
			g.main.addChild(s);
		}
	}
	function init(div, fn) {
		div = div instanceof jQuery ? div : u.isStr(div) ? $(div) : $(document.body);
		var stage, main, renderer,
			ATLAS = g.ATLAS_PATH;
		
		PIXI.utils.skipHello();
		g.renderer = PIXI.autoDetectRenderer(
			window.innerWidth,
			window.innerHeight,
			{
				backgroundColor: 0x0000ff,// 0xf5eed8, // 0xAB9988, // 0xAB9999,
				antialias: true,
				transparent: true
			}
		);
		div.append( g.renderer.view );
		g.stage = new PIXI.Container();
		g.main = new PIXI.Container();
		
		renderer = g.renderer;
		stage = g.stage;
		main = g.main;
		
		stage.addChild( main );
		
		PIXI.loader.add( ATLAS );
		PIXI.loader.load(function () {
			g.textures = PIXI.loader.resources[ATLAS].textures;
			if ( u.isFn(fn) ) {
				fn();
			}
			start();
		});
		requestAnimationFrame( animate );
		renderer.render( stage );
	}
	
	inst.init = init;
	inst.newNode = newNode;
	
	return inst;
});