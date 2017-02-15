define(['util'], function (u) {
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
	
	var tile;
	
	function addEvt() {
		$("canvas").on("mousewheel", mousewheel);
	}
	function makeDraggable(el) {
		el.interactive = true;
		el
			.on("mousedown", dragStart)
			.on("touchstart", dragStart)
			.on("mouseup", dragEnd)
			.on("mouseupoutside", dragEnd)
			.on("touchend", dragEnd)
			.on("touchendoutside", dragEnd)
			.on("mousemove", dragMove)
			.on("touchmove", dragMove);
	}
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
		var arr;
		e.stopPropagation();
		this.data = e.data;
		this.alpha = 0.5;
		this.dragging = true;
		this.dragPoint = e.data.getLocalPosition(this.parent);
		this.dragPoint.x -= this.position.x;
		this.dragPoint.y -= this.position.y;
		
		arr = this.parent.children;
		arr.splice( arr.indexOf(this), 1 );
		arr.push(this);
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
	function mousewheel(e) {
		zoom(e.pageX, e.pageY, e.deltaY > 0);
	}
	function start() {
		tile = new PIXI.extras.TilingSprite.fromImage(g.BG_PATH, g.renderer.width / g.renderer.resolution * 1000000, g.renderer.height / g.renderer.resolution *1000000);
		tile.position.x = -1000000;
		tile.position.y = -1000000;
		g.main.addChild(tile);
		
		
		// var s = new PIXI.Sprite.fromImage( "images/1.png");
		var i;
		var s;
		var x = 0;
		var y = 0;
		for (i=0; i<9; i+=1) {
			s = new PIXI.Sprite( g.textures[i+".png"] );
			s.scale.set(0.5);
			s.x = x;
			s.y = y;
			x+=50;
			y+=50;
			makeDraggable(s);
			g.main.addChild(s);
		}
	}
	function zoom(x, y, zoomIn) {
		var direction = (zoomIn) ? 1 : -1,
			factor = (1 + direction * 0.05),
			local_pt = new PIXI.Point(),
			point = new PIXI.Point(x, y),
			el = g.main;
		
		PIXI.interaction.InteractionData.prototype.getLocalPosition(el, local_pt, point);
		
		el.scale.x *= factor;
		el.scale.y *= factor;
		el.pivot = local_pt;
		el.position = point;
	}
	function init(div, fn) {
		div = div instanceof jQuery ? div : u.isStr(div) ? $(div) : $(document.body);
		var stage, main, renderer,
			renReso,
			N = 100000,
			ATLAS = g.ATLAS_PATH;
		
		PIXI.utils.skipHello();
		g.renderer = PIXI.autoDetectRenderer(
			window.innerWidth,
			window.innerHeight,
			{
				backgroundColor: 0xFF0000 ,// 0xf5eed8, // 0xAB9988, // 0xAB9999,
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
		
		renReso = renderer.resolution;
		stage.hitArea = new PIXI.Rectangle( -N, -N, renderer.width / renReso * N, renderer.height / renReso *N );
		makeDraggable(main);
		addEvt();
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