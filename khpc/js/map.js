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
	
	var pan = (function () {
		var el,
			prevX, prevY,
			bounds = {};
		
		function down(e) {
			this.dragging = true;
			var pos = e.data.global;
			prevX = pos.x;
			prevY = pos.y;
			isDragging = true;
		}
		function move(e) {
			var el = g.main,
				pos = e.data.global,
				dx = pos.x - prevX,
				dy = pos.y - prevY;
			if ( this.dragging ) { 
				el.position.x += dx;
				el.position.y += dy;
				prevX = pos.x;
				prevY = pos.y;
			}
		}
		function up(e) {
			this.dragging = false;
		}
		function add(element) {
			el = element;
			var ren = g.renderer,
				renReso = ren.resolution;
			
			element.interactive = true;
			element.hitArea = new PIXI.Rectangle( -100000, -100000, ren.width / renReso * 100000, ren.height / renReso *100000 );
			element
				.on("mousedown", down)
				.on("touchstart", down)
				.on("mouseup", up)
				.on("mouseupoutside", up)
				.on("touchend", up)
				.on("touchendoutside", up)
				.on("mousemove", move)
				.on("touchmove", move);
		}
		
		return add;
	}());
	function addEvt() {
		$("canvas").on("mousewheel", mousewheel);
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
	function start() {
		var tile = new PIXI.extras.TilingSprite.fromImage(g.BG_PATH, g.renderer.width / g.renderer.resolution * 100000, g.renderer.height / g.renderer.resolution *100000);
		tile.position.x = -100000;
		tile.position.y = -100000;
		g.main.addChild(tile);
		
		
		// var s = new PIXI.Sprite.fromImage( "images/1.png");
		var i;
		var s;
		for (i=0; i<9; i+=1) {
			s = new PIXI.Sprite( g.textures[i+".png"] );
			s.interactive = true;
			
			s.scale.set(0.5);
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
		
		pan(main);
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