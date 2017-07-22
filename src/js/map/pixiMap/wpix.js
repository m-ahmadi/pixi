define([], function () {
	var inst = u.extend( newPubSub() ),
		p = {};
	
	p.renderer = {};
	p.stage = {};
	p.mainContainer = {};
	
	p.viewport = {};
	p.xSec1 = {};
	p.xSec2 = {};
	p.ySec1 = {};
	p.ySec2 = {};
	
	p.textures = {};
	p.zoom = true;
	p.events = true;
	
	p.zoomLevel = 0;
	p.MAX_ZOOM_OUT = -12;
	p.MAX_ZOOM_IN = 8;
	
	function init(o) {
		o = o ? o : {};
		var callback = o.callback,
			panBounds = o.panBounds,
			background = o.background,
			div = o.containerDiv;
			div = div instanceof jQuery ? div : u.isStr(div) ? $(div) : undefined;
		
		var renderer, renW, renH, renReso, stage, mainContainer;
		
		pan.setBounds(panBounds);
		PIXI.utils.skipHello();
		p.renderer = PIXI.autoDetectRenderer(
			window.innerWidth,
			window.innerHeight,
			{
				backgroundColor: background || 0xAB9988, // 0xAB9999,
				antialias: true,
		//		resolution: false,
		//		transparent: false,
		//		preserveDrawingBuffer: false,
		//		view: HTMLCanvasElement
			}
		//	noWebGL: false,                    // optional
		);
		
		p.stage = new PIXI.Container();
		p.mainContainer = new PIXI.Container();
		
		renderer = p.renderer;
		renW = renderer.width;
		renH = renderer.height;
		renReso = renderer.resolution;
		stage = p.stage;
		mainContainer = p.mainContainer;
		
		// document.body.appendChild( p.renderer.view );
		div.append( renderer.view );
		
		//p.stage.buttonMode = true;
		mainContainer.interactive = true;
		mainContainer.hitArea = new PIXI.Rectangle( -100000, -100000, renW / renReso * 100000, renH / renReso *100000 );
		pan.add( mainContainer );
		
		$("canvas").on({
			"mousewheel": mousewheel,
			"mouseout": function () {
				p.events = false;
			},
			"mouseover": function () {
				p.events = true;
			},
			"contextmenu": function (e) {
				e.preventDefault();
			}
		});
		$('#contextmenu').on('contextmenu', function (e) {
			// e.preventDefault(); // ctxmenu_wrap
		});
		
		createContainers();
		stage.addChild( mainContainer );
		
		// PIXI.loader.add( "images/atlas-0.json" );
		PIXI.loader.add( "images/n/atlas64.json" );
		PIXI.loader.load(function () {
			// p.textures = PIXI.loader.resources["images/atlas-0.json"].textures;
			p.textures = PIXI.loader.resources["images/n/atlas64.json"].textures;
			if ( u.isFn(callback) ) {
				callback(renW, renH);
			}
		});
		requestAnimationFrame( animate );
		renderer.render( mainContainer );
		inst.emit("init");
	}
	
	function mousewheel(e) {
		var zoomIn,
			deltaY = e.deltaY,
			mcPos, prevPos,
			zoomLevel;
			
		p.zoomLevel += deltaY;
		zoomLevel = p.zoomLevel;
		
		/* e.deltaX, e.deltaY, e.deltaFactor
		zoom(e.pageX, e.pageY, e.deltaY > 0);
		zoom(e); */
		
		
		/* if (p.zoom) {
			zoomIn = deltaY > 0;
			
			if (zoomLevel > p.MAX_ZOOM_OUT  &&  zoomLevel < p.MAX_ZOOM_IN) {
				mcPos = p.mainContainer.position;
				prevPos = {x: mcPos.x, y: mcPos.y};
				
				zoom(e.pageX, e.pageY, zoomIn);
				
				inst.emit("zoom", {
					zoomIn: zoomIn,
					pos: mcPos
				});
			} else {
				if (zoomIn) {
					p.zoomLevel = p.MAX_ZOOM_IN;
				} else {
					p.zoomLevel = p.MAX_ZOOM_OUT;
				}
			}
		} */
		zoomIn = deltaY > 0;
		zoom(e.pageX, e.pageY, zoomIn);
	}
	function createContainers() {
		var viewport, xSec1, xSec2, ySec1, ySec2,
			main = p.mainContainer;
		
		viewport = new PIXI.Container();
		xSec1    = new PIXI.Container();
		xSec2    = new PIXI.Container();
		ySec1    = new PIXI.Container();
		ySec2    = new PIXI.Container();
		
		add( viewport );
		add( xSec1    );
		add( xSec2   );
		add( ySec1     );
		add( ySec2    );
		
		main.addChild( viewport );
		main.addChild( xSec1    );
		main.addChild( xSec2   );
		main.addChild( ySec1     );
		main.addChild( ySec2    );
		
		p.viewport = viewport;
		p.xSec1    = xSec1;
		p.xSec2    = xSec2;
		p.ySec1    = ySec1;
		p.ySec2    = ySec2;
	}
	function add(el) {
		var lineContainer = new PIXI.Container(),
			nodeContainer = new PIXI.Container();
		el.addChild(lineContainer);
		el.addChild(nodeContainer);
	}
	function clearContainer(k) {
		var r = p[k];
		r.children[0].destroy(true); // lineContainer
		r.children[0].destroy();     // nodeContainer
		add(r);
	}
	function addChild(k, str, child) {
		var i;
		if (str === "lineContainer") {
			i = 0;
		} else if (str === "nodeContainer") {
			i = 1;
		}
		p[k].children[i].addChild(child);
	}
	function animate() {
		requestAnimationFrame(animate);
		//tink.update();
		//TWEEN.update();
		p.renderer.render(p.stage);
	}
	function coPoint(x, y) {
		return new PIXI.Point(x, y);
	}
	function zoom(x, y, zoomIn) {
		var direction = (zoomIn) ? 1 : -1,
			factor = (1 + direction * 0.05),
			local_pt = new PIXI.Point(),
			point = new PIXI.Point(x, y),
			mainContainer = p.mainContainer;
		
		PIXI.interaction.InteractionData.prototype.getLocalPosition(mainContainer, local_pt, point);
		
		mainContainer.scale.x *= factor;
		mainContainer.scale.y *= factor;
		mainContainer.pivot = local_pt;
		mainContainer.position = point;
	}
	var pan = (function () {
		var isDragging = false,
			prevX,
			prevY,
			bounds = {};
		
		function down(e) {
			isDragging = true;
			//downX = e.data.global.x;
			//downY = e.data.global.y;
			
			var pos = e.data.global;
			prevX = pos.x;
			prevY = pos.y;
			isDragging = true;
		}
		function move(e) {
			if ( !isDragging ) { return; }
			var pos = e.data.global,
				dx = pos.x - prevX,
				dy = pos.y - prevY,
				mcX = p.mainContainer.position.x,
				mcY = p.mainContainer.position.y,
				bX1 = bounds.x1,
				bX2 = bounds.x2,
				bY1 = bounds.y1,
				bY2 = bounds.y2,
				negate = u.negateNum,
				posit = u.positNum;
			
			
			if (mcX <= bX1    &&    mcX >= bX2) {
				p.mainContainer.position.x += dx;
				inst.emit("inboundPanX", dx);
			} else {
				p.mainContainer.position.x = mcX > 0 ? bX1 : mcX < 0 ? bX2 : undefined;
			}
			
			if (mcY <= bY1    &&    mcY >= bY2) {
				p.mainContainer.position.y += dy;
				inst.emit("inboundPanY", dy);
			} else {
				p.mainContainer.position.y = mcY > 0 ? bY1 : mcY < 0 ? bY2 : undefined;
			}
			
			prevX = pos.x;
			prevY = pos.y;
			
			inst.emit("pan", p.mainContainer.position);
		}
		function up(e) {
			isDragging= false;
			inst.emit("stageClick", e.data.global);
		}
		function pan(x, y) {
			if ( x  &&  y ) {
				p.mainContainer.position.x += x;
				p.mainContainer.position.y += y;
			}
		}
		function add(el) {
			el
				.on("mousedown", down)
				.on("touchstart", down)
				.on("mouseup", up)
				.on("mouseupoutside", up)
				.on("touchend", up)
				.on("touchendoutside", up)
				.on("mousemove", move)
				.on("touchmove", move);
		}
		function setBounds(o) {
			o = o ? o : {};
			var posit = u.positNum,
				negate = u.negateNum;
				
			// changing bound signs for easier calculation later.
			bounds.x1 = posit(o.X_1);
			bounds.x2 = negate(o.X_2);
			bounds.y1 = posit(o.Y_1);
			bounds.y2 = negate(o.Y_2);
		}
		
		return {
			get: function () { return bounds; },
			setBounds: setBounds,
			pan: pan,
			add: add
		};
	}());
	function create2pointLine(conf) {
		conf = conf ? conf : {};
		
		var line,
			start, end,
			lineWidth, tmpLineWidth,
			alpha, color,
			p,
			handlers = {};
		
		function setThings() {
			start     =  conf.start     ||  {x: 0, y: 0};
			end       =  conf.end       ||  {x: 0, y: 0};
			lineWidth =  conf.lineWidth ||  2;
			color     =  conf.color     ||  0x000000;
			alpha     =  conf.alpha;
			alpha     =  u.isNum(alpha) ? alpha : 1;
			p         =  calcPoints();
		}
		function setStart(s) {
			if (s) {
				start = s;
			}
		}
		function setEnd(e) {
			if (e) {
				end = e;
			}
		}
		function setLineWidth(w) {
			if (w) {
				lineWidth = w;
			}
		}
		function setColor(c) {
			if (c) {
				color = c;
			}
		}
		function increaseWidth(factor) {
			factor = u.isNum(factor) && factor ? factor : 4;
			// console.log("hover");
			tmpLineWidth = lineWidth;
			lineWidth *= factor;
			redraw();
		}
		function defaultWidth() {
			// console.log("unhover");
			lineWidth = tmpLineWidth;
			redraw();
		}
		function redraw() {
			p = calcPoints();
			line.clear();
			draw();
			toggleDirties();
		}
		function down(e) {
			e.stopPropagation();
			this.alpha = 0.5;
			
			execute("mousedown", e, this);
		}
		function up(e) {
			e.stopPropagation();
			this.alpha = 1;
			
			execute("mouseup", e, this);
		}
		function over() {
			// hover();
		}
		function out() {
			// unhover();
		}
		function rightup(e) {
			execute("rightup", e, this);
		}
		function execute(str, e, ctx) {
			var handler = handlers[str] || {}, 
				fn = handler.fn,
				param = handler.param;
			if ( u.isFn(fn) ) {
				fn.apply(ctx, param ? [e].concat(param) : [e]);
			}
		}
		function addEvents() {
			line
				.on("mousedown", down) 
				.on("touchstart", down)
				.on("mouseup", up)
				.on("mouseupoutside", up)
				.on("touchend", up)
				.on("touchendoutside", up)
			//	.on("mousemove", move)
			//	.on("touchmove", move)
				.on("mouseover", over)
				.on("mouseout", out)
				.on("rightup", rightup);
		}
		function toggleDirties() {
			var dirty = line.dirty,
				clearDirty = line.clearDirty;
			
			dirty = dirty ? false : true;
			clearDirty = clearDirty ? false : true;
		}
		function calcPoints() {
			var half = lineWidth / 2,
				sLeft = {},
				sRight = {},
				eRight = {},
				eLeft = {},
				sX = start.x,
				sY = start.y,
				eX = end.x,
				eY = end.y,
				results = {};

			if ( (sX < eX  &&  sY < eY)  || // topLeft to bottRight
					(sX > eX  &&  sY > eY) ) { // bottRight to topLeft
				sLeft = new PIXI.Point( sX-half, sY+half );
				sRight = new PIXI.Point( sX+half, sY-half );
				eRight = new PIXI.Point( eX+half, eY-half );
				eLeft = new PIXI.Point( eX-half, eY+half );
			} else if ( (sX > eX  &&  sY < eY) || // topRight to bottLeft
					(sX < eX  &&  sY > eY) ) { // bottLeft to topRight
				sLeft = new PIXI.Point( sX-half, sY-half );
				sRight = new PIXI.Point( sX+half, sY+half );
				eRight = new PIXI.Point( eX+half, eY+half );
				eLeft = new PIXI.Point( eX-half, eY-half );
			} else if ( sX === eX  &&
					(sY > eY  ||  sY < eY) ) { // vertical
				sLeft = new PIXI.Point( sX-half, sY );
				sRight = new PIXI.Point( sX+half, sY);
				eRight = new PIXI.Point( eX+half, eY );
				eLeft = new PIXI.Point( eX-half, eY );
				
			} else if ( sY === eY  &&
					(sX < eX  ||  sX > eX) ) { // horizontal
				sLeft = new PIXI.Point( sX, sY+half );
				sRight = new PIXI.Point( sX, sY-half );
				eRight = new PIXI.Point( eX, eY-half );
				eLeft = new PIXI.Point( eX, eY+half );
			}
			
			results.sLeft = sLeft;
			results.sRight = sRight;
			results.eRight = eRight;
			results.eLeft = eLeft;
			
			return results;
		}
		function changeColor(c) {
			setColor(c);
			line.clear();
			draw();
			toggleDirties();
		}
		function changePoints(s, e) {
			setStart(s);
			setEnd(e);
			p = calcPoints();
			line.clear();
			draw();
			toggleDirties();
		}
		function bringToFront(container) {
			var el = line,
				arr = el.parent.children;
			
			arr.splice( arr.indexOf(el), 1 );
			arr.push(el);
		}
		function draw() {
			line.beginFill( color );
			line.moveTo( p.sLeft.x, p.sLeft.y );
			line.lineTo( p.sRight.x, p.sRight.y );
			line.lineTo( p.eRight.x, p.eRight.y );
			line.lineTo( p.eLeft.x, p.eLeft.y );
			line.endFill();
		}
		function createElement() {
			var line;
			
			line = new PIXI.Graphics();
			line.interactive = true;
			line.buttonMode = true;
			line.lineStyle(0);
			
			return line;
		}
		function create() {
			line = createElement();
			addEvents( line );
			draw();
		}
		
		setThings();
		create();
		line.alpha = alpha;
		
		line.setHandler = function (evt, fn, param) {
			handlers[evt] = {
				fn: fn,
				param: param
			};
		};
		line.changePoints = changePoints;
		line.changeColor = changeColor;
		line.bringToFront = bringToFront;
		line.increaseWidth = increaseWidth;
		line.defaultWidth = defaultWidth;
		Object.defineProperty(line, "points", {
			get: function () { return {start: start, end: end}; }
		});
		
		return line;
	}
	function createBoxSpriteText(conf) {
		conf = conf ? conf : {};
		var sprite,
			text,
			box,
			imgFill, imgBasePath, imgName, imgExt, img,
			spriteImg, spriteScale, spriteTint,
			textContent, textFont, textSize, textColor,
			boxX, boxY, boxAlpha,
			handlers = {},
			counter = 0;
		
		function setThings() {
			imgFill     = conf.imgFill      || false;
		//	imgBasePath = conf.imgBasePath  || "images/raw/edited/"; // images/
			imgName     = conf.imgName      || "0"; // "tv-screen"; // tv-screen computer
			imgExt      = conf.imgExt       || ".png";
			spriteScale = conf.spriteScale  || 0.2;
			spriteTint  = conf.spriteTint   || false;
			textContent = conf.textContent  || "no_name";
			textFont    = conf.textFont     || "Arial";
			textSize    = conf.textSize     || "16px";
			textColor   = conf.textColor    || "black";
			boxX        = conf.x            || 0;
			boxY        = conf.y            || 0;
			boxAlpha    = conf.boxAlpha;
			boxAlpha    = u.isNum(boxAlpha) ? boxAlpha : 1;
		//	spriteImg   = conf.spriteImg    || imgBasePath + imgName + (imgFill ? "-fill":"-trans") + imgExt;
		//	spriteImg   = conf.spriteImg    || imgName + (imgFill ? "-fill" : "-trans") + imgExt;
			spriteImg   = conf.spriteImg    || imgName + imgExt;
		}
		function bringToFront() {
			var el = box
				arr = el.parent.children;
				
			arr.splice( arr.indexOf(el), 1 );
			arr.push(el);
		}
		function down(e) {
			e.stopPropagation();
			this.data = e.data;
			this.alpha = 0.5;
			this.dragging = true;
			this.dragPoint = e.data.getLocalPosition(this.parent);
			this.dragPoint.x -= this.position.x;
			this.dragPoint.y -= this.position.y;
			
			execute("mousedown", e, this);
		}
		function up(e) {
			e.stopPropagation();
			this.alpha = 1;
			this.dragging = false;
			this.data = null;
			
			execute("mouseup", e);
		}
		function move(e) {
			if ( this.dragging ) {
				var newPosition = this.data.getLocalPosition(this.parent);
				this.position.x = newPosition.x - this.dragPoint.x;
				this.position.y = newPosition.y - this.dragPoint.y;
				
				execute("mousemove", e, this);
			}
		}
		function over(e) {
			if(!this.dragging) {
				execute("mouseover", e, this);
			}
		}
		function out(e) {
			if(!this.dragging) {
				execute("mouseout", e, this);
			}
		}
		function rightup(e) {
			execute("rightup", e, this);
		}
		function execute(str, e, ctx) {
			var handler = handlers[str] || {},
				fn = handler.fn,
				param = handler.param;
			if ( u.isFn(fn) ) {
				fn.apply(ctx, param ? [e].concat(param) : [e]);
			}
		}
		function addEvents(el) {
			el
				.on("mousedown", down) 
				.on("touchstart", down)
				.on("mouseup", up)
				.on("mouseupoutside", up)
				.on("touchend", up)
				.on("touchendoutside", up)
				.on("mousemove", move)
				.on("touchmove", move)
				.on("mouseover", over)
				.on("mouseout", out)
				.on('rightup', rightup);
		}
		function makeSprite() {
			// sprite = new PIXI.Sprite.fromImage( spriteImg );
			sprite = new PIXI.Sprite( p.textures[spriteImg] );
			sprite.interactive = true;
			sprite.buttonMode = true;
			sprite.anchor.set(0, 0);
			sprite.alpha = 1;
			sprite.scale.set( spriteScale );
			if (spriteTint) {
				if (spriteTint === 0) {
					sprite.tint = 0x4CAF50; // Green
				} else if (spriteTint === 1) {
					sprite.tint = 0x00FFFF; // Cyan
				} else if (spriteTint === 2) {
					sprite.tint = 0xFF9800; // Orange
				} else if (spriteTint === 3) {
					sprite.tint = 0x00FF00; // Yellow
				} else if (spriteTint === 4) {
					sprite.tint = 0x673AB7; // Purple
				} else if (spriteTint === 5) {
					sprite.tint = 0xFF0000; // Red
				}
				
				// sprite.tint = 0xFFCC00 * spriteTint;
			}
			sprite.position.x = 0.5;
			sprite.position.y = 0.5;
		}
		function makeText() {
			text = new PIXI.Text( textContent, {
				fontFamily: textFont,
				fontSize: textSize,
				fill: textColor
			});
			text.interactive = true;
			text.buttonMode = true;
			text.y = sprite.y + sprite.height;
		}
		function makeBox() {
			box = new PIXI.Container();
			// box = new PIXI.particles.ParticleContainer();
			box.interactive = true;
			box.buttonMode = true;
			box.scale.set(1);
			box.alpha = boxAlpha;
			box.position.x = boxX;
			box.position.y = boxY;
			box.hitArea = new PIXI.Rectangle(0, 0, sprite.width, sprite.height);
			addEvents(box);
			box.addChild(sprite); 
			box.addChild(text);
		}
		
		setThings();
		makeSprite();
		makeText();
		makeBox();
		
		box.setHandler = function (evt, fn, param) {
			handlers[evt] = {
				fn: fn,
				param: param
			};
		};
		box.changeTint = function (n) {
			if (n) {
				sprite.tint = n;
			}
		};
		box.bringToFront = bringToFront;
		box.sprite = sprite;
		
		return box;
	}
	
	Object.defineProperties(inst, {
		"renderer": {
			get: function () { return p.renderer; }
		},
		"stage": {
			get: function () { return p.stage; }
		},
		"mainContainer": {
			get: function () { return p.mainContainer; }
		},
		"viewport": {
			get: function () { return p.viewport; }
		},
		"textures": {
			get: function () { return p.textures; }
		},
		"zoom": {
			get: function () { return p.zoom; },
			set: function (v) { p.zoom = v; }
		},
		"events": {
			get: function () { return p.events; },
			set: function (v) { p.events = v; }
		}
	});
	
	inst.hide = () => {
		p.renderer.view.style.display = "none";
	};
	inst.show = () => {
		p.renderer.view.style.display = "";
	};
	inst.init = init;
	inst.coPoint = coPoint;
	inst.clearContainer = clearContainer;
	inst.addChild = addChild;
	inst.create2pointLine = create2pointLine;
	inst.createBoxSpriteText = createBoxSpriteText;
	
	window.wpix = inst;
	return inst;
});