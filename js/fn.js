var baseRoot = '192.168.10.13:3000', t;

var a = (function () {
"use strict";


var pixi = (function () {
	var inst = util.extend( newPubSub() ),
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
	p.zoomDisabled = false;
	
	function init(callback, panBounds, background) {
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
		$("#contents").append( renderer.view );
		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		//p.stage.buttonMode = true;
		mainContainer.interactive = true;
		mainContainer.hitArea = new PIXI.Rectangle( -100000, -100000, renW / renReso * 100000, renH / renReso *100000 );
		pan.add( mainContainer );
			
		$(document).on("mousewheel", function (e) {
			var zoomIn, mcPos, prevPos;
			// e.deltaX, e.deltaY, e.deltaFactor
			// zoom(e.pageX, e.pageY, e.deltaY > 0);
			// zoom(e);
			if (!p.zoomDisabled) {
				zoomIn = e.deltaY > 0,
				mcPos = p.mainContainer.position,
				prevPos = {x: mcPos.x, y: mcPos.y};
				
				zoom(e.pageX, e.pageY, zoomIn);
				
				inst.publish("zoom", {
					zoomIn: zoomIn,
					pos: mcPos
				});
			}
		});
		createContainers();
		stage.addChild( mainContainer );
		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		requestAnimationFrame( animate );
		renderer.render( mainContainer );
		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		/* var basePath = "images/raw/edited/",
		images = [
			"computer", "gamepad", "hard-drive", "imac-blue",
			"imac-grey", "imac-red", "ipad", "iphone", "macbook",
			"macintosh", "monitor", "playstation", "smartphone",
			"smart-tv", "smartwatch", "tv-screen", "video-card", "xbox"
		];
		images.forEach(function (i) {
			var imgTrans = basePath+i+"-trans.png",
				imgFill = basePath+i+"-fill.png";
			PIXI.loader.add( imgTrans );
			PIXI.loader.add( imgFill );
		});
		PIXI.loader.load(); */
		
		PIXI.loader.add( "images/computer.png" );
		PIXI.loader.add( "images/hard.png" );
		PIXI.loader.add( "images/atlas-0.json" );
		PIXI.loader.load(function () {
			p.textures = PIXI.loader.resources["images/atlas-0.json"].textures;
			callback(renW, renH);
		});
		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		inst.publish("init");
	}
	
	function disableZoom(v) {
		p.zoomDisabled = v;
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
			factor = (1 + direction * 0.1),
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
				negate = util.negateNum,
				posit = util.positNum;
			
			
			var opened = popupManager.activeBox,
				pTop = opened ? parseInt( opened.css('top'), 10) : undefined,
				pLeft = opened ? parseInt( opened.css('left'), 10) : undefined;
			
			if (mcX <= bX1    &&    mcX >= bX2) {
				if (opened) {
					opened.css('left', pLeft += dx);
				}
				p.mainContainer.position.x += dx;
			} else {
				p.mainContainer.position.x = mcX > 0 ? bX1 : mcX < 0 ? bX2 : undefined;
			}
			
			if (mcY <= bY1    &&    mcY >= bY2) {
				if (opened) {
					opened.css('top', pTop += dy);
				}
				
				p.mainContainer.position.y += dy;
			} else {
				p.mainContainer.position.y = mcY > 0 ? bY1 : mcY < 0 ? bY2 : undefined;
			}
			
			prevX = pos.x;
			prevY = pos.y;
			
			inst.publish("pan", p.mainContainer.position);
		}
		function up() {
			isDragging= false;
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
			var posit = util.positNum,
				negate = util.negateNum;
				
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
			onmousedown, onmousedownParam,
			onmouseup, onmouseupParam;
		
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
		function down(e) {
			e.stopPropagation();
			this.alpha = 0.5;
			
			if ( u.isFn(onmousedown) ) {
				onmousedown.apply(undefined, onmousedownParam);
			}
		}
		function up() {
			this.alpha = 1;
			if ( u.isFn(onmouseup) ) {
				onmousedown.apply(undefined, onmouseupParam);
			}
		}
		function over() {
			tmpLineWidth = lineWidth;
			lineWidth *= 4;
			p = calcPoints();
			line.clear();
			draw();
			toggleDirties();
		}
		function out() {
			lineWidth = tmpLineWidth;
			p = calcPoints();
			line.clear();
			draw();
			toggleDirties();
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
				.on("mouseout", out);
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
		
		line.setOnmousedown = function (param, fn) {
			onmousedownParam = param;
			onmousedown = fn;
		};
		line.setOnmouseup = function (param, fn) {
			onmouseupParam = param;
			onmouseup = fn;
		};
		line.setOnmousemove = function (param, fn) {
			onmousemoveParam = param;
			onmousemove = fn;
		};
		line.changePoints = changePoints;
		line.changeColor = changeColor;
		Object.defineProperty(line, "points", {
			get: function () { return {start: start, end: end}; }
		});
		
		return line;
	}
	function create3pointLine(conf) {
		conf = conf ? conf : {};
		var line,
			start, end, ctrl,
			color, width,
			curveLevel, curveSide;
		
		function setThings() {
			start      = conf.start      || {x: 50 , y: 50};
			end        = conf.end        || {x: 600, y: 200};
			color      = conf.color      || 0x000000;
			width      = conf.width      || 2;
			curveLevel = conf.curveLevel || 0;
			curveSide  = conf.curveSide  || false; // true top, false down
			ctrl       = calcBetween(start, end);
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
		function setWidth(w) {
			if (w) {
				width = w;
			}
		}
		function setColor(c) {
			if (c) {
				color = c;
			}
		}
		function calcBetween(s, e) {
			var sX = s.x,
				sY = s.y,
				eX = e.x,
				eY = e.y,
				diffX, diffY,
				hX, hY;
				
			if (sX > eX) {
				diffX = sX - eX;
				hX = sX - (diffX / 2);
			} else if (sX < eX) {
				diffX = eX - sX;
				hX = sX + (diffX / 2);
			} else if (sX === eX) {
				hX = sX || eX;
			}
			
			if (sY > eY) {
				diffY = sY - eY;
				hY = sY - (diffY / 2);
			} else if (sY < eY) {
				diffY = eY + sY;
				hY = sY + (diffY / 2);
			} else if (sY === eY) {
				hY = sY || eY;
			}

			//debugger;
			return {
				x: hX,
				y: hY
			};
		}
		function changeColor(c) {
			setColor(c);
			line.clear();
			draw();
			toggleDirties();
		}
		function toggleDirties() {
			var dirty = line.dirty,
				clearDirty = line.clearDirty;
			
			dirty = (dirty) ? false : true;
			clearDirty = (clearDirty) ? false : true;
		}
		function incCurve() {
			var sX = start.x,
				sY = start.y,
				eX = end.x,
				eY = end.y,
				incX = 0,
				incY = 0,
				unit = 5;
			
			if ( (sX < eX  &&  sY < eY)  || // topLeft to bottRight
					(sX > eX  &&  sY > eY) ) { // bottRight to topLeft
				incX = curveSide ? unit : -unit;
				incY = curveSide ? -unit : unit;
			} else if ( (sX > eX  &&  sY < eY) || // topRight to bottLeft
					(sX < eX  &&  sY > eY) ) { // bottLeft to topRight
				incX = curveSide ? -unit : unit;
				incY = curveSide ? -unit : unit;
			} else if ( sX === eX  &&
					(sY > eY  ||  sY < eY) ) { // vertical
				incX = curveSide ? -unit : unit;
			} else if ( sY === eY  &&
					(sX < eX  ||  sX > eX) ) { // horizontal
				incY = curveSide ? -unit : unit;
			}
			
			ctrl.x += incX * curveLevel;
			ctrl.y += incY * curveLevel;
		}
		function changePoints(s, e) {
			setStart(s);
			setEnd(e);
			ctrl = calcBetween(start, end);
			line.clear();
			if (curveLevel) {
				incCurve();
			}
			draw();
			toggleDirties();
		}
		function draw() {
			line.lineStyle(width, color, 1);
			line.moveTo(start.x, start.y);
			line.quadraticCurveTo(ctrl.x, ctrl.y, end.x, end.y);
		}
		function create() {
			line = new PIXI.Graphics();
			line.interactive = true;
			line.buttonMode = true;
		}
		
		setThings();
		create();
		if (curveLevel) {
			incCurve();
		}
		draw();
		
		line.changeColor = changeColor;
		line.changePoints = changePoints;
		
		//p.mainContainer.addChild(line);
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
			onmouseup, onmouseupParam,
			onmousedown, onmousedownParam,
			onmousemove, onmousemoveParam,
			counter = 0;
		
		function setThings() {
			imgFill     = conf.imgFill      || false;
			imgBasePath = conf.imgBasePath  || "images/raw/edited/"; // images/
			imgName     = conf.imgName      || "tv-screen"; // tv-screen computer
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
			spriteImg   = conf.spriteImg    || imgName + (imgFill ? "-fill" : "-trans") + imgExt;
		}
		function down(e) {
			e.stopPropagation();
			this.data = e.data;
			this.alpha = 0.5;
			this.dragging = true;
			this.dragPoint = e.data.getLocalPosition(this.parent);
			this.dragPoint.x -= this.position.x;
			this.dragPoint.y -= this.position.y;
			
			if ( u.isFn(onmousedown) ) {
				onmousedown.apply(this, onmousedownParam ? [e].concat(onmousedownParam) : [e]);
			}
		}
		function up(e) {
			this.alpha = 1;
			this.dragging = false;
			this.data = null;
			if ( u.isFn(onmouseup) ) {
				onmouseup.apply(this, onmouseupParam ? [e].concat(onmouseupParam) : [e]);
			}
		}
		function move(e) {
			if ( this.dragging ) {
				var newPosition = this.data.getLocalPosition(this.parent);
				this.position.x = newPosition.x - this.dragPoint.x;
				this.position.y = newPosition.y - this.dragPoint.y;
				
				if ( u.isFn(onmousemove) ) {
					onmousemove.apply(this, onmousemoveParam ? [e].concat(onmousemoveParam) : [e]);
				}
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
				.on("touchmove", move);
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
				sprite.tint = 0xFFCC00 * spriteTint;
			}
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
		
		box.setOnmouseup = function (param, fn) {
			onmouseupParam = param;
			onmouseup = fn;
		};
		box.setOnmousedown = function (param, fn) {
			onmousedownParam = param;
			onmousedown = fn;
		};
		box.setOnmousemove = function (param, fn) {
			onmousemoveParam = param;
			onmousemove = fn;
		};
		box.changeTint = function (n) {
			if (n) {
				sprite.tint = n;
			}
		};
		
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
		}
	});
	
	inst.init = init;
	inst.coPoint = coPoint;
	inst.create2pointLine = create2pointLine;
	inst.create3pointLine = create3pointLine;
	inst.createBoxSpriteText = createBoxSpriteText;
	inst.clearContainer = clearContainer;
	inst.addChild = addChild;
	inst.disableZoom = disableZoom;
	
	return inst;
}());

var ani = (function () {
	function fade(inOut, pixiEl, o) {
		o = o ? o : {};
		
		TweenLite.to(
			pixiEl,
			o.dur || 0.5,
			{
				alpha: inOut ? 1 : 0,
				yoyo: true,
				ease: Linear.easeInOut,
				onComplete: o.done,
				onCompleteParams: o.donePar,
				onCompleteScope: o.doneCtx
			}
		);
	}
	function fadeIn(pixiEl, o) {
		fade(true, pixiEl, o);
	}
	function fadeOut(pixiEl, o) {
		fade(false, pixiEl, o);
	}
	/*
	TweenLite.to(box.scale, 0.3, {
		x: 1,
		y: 1,
		yoyo: true,
		ease: Linear.easeInOut,
		onComplete: o.done,
		onCompleteParams: o.doneParams,
		onCompleteScope: o.doneCtx
	});
	*/
	
	return {
		fadeIn: fadeIn,
		fadeOut: fadeOut
	};
}());

var tpl = (function () {
	var p = {};
	
	p.nodes = {};
	p.links = {};
	p.idCounter = 0;
	p.types = [
		"tv-screen", "macintosh", "imac-blue", "smart-tv", "imac-red",
		"imac-grey", "monitor", "ipad", "iphone", "macbook",
		"computer", "gamepad", "playstation", "hard-drive",
		"smartphone", "smartwatch", "video-card", "xbox"
	];
	
	function createNode(o, container, coefficient) {
		o = o ? o : {};
		var node,
			type, name, id, thisLinks,
			x, y,
			boxSpriteText;
		
		function setThings() {
			type      = o.type  || 0;
			id        = o.id    || "tpl_node_"+(p.idCounter+=1);
		//	name      = o.name  || "Node "+(p.idCounter+=1);
			name      = o.name  || o.management_ip  || "Node "+(p.idCounter+=1);
			x         = o.x;
			y         = o.y;
			thisLinks = o.links || false;
		}
		function createBox() {
			boxSpriteText = pixi.createBoxSpriteText({
				x: coefficient ? x*coefficient.x : x,
				y: coefficient ? y*coefficient.y : y,
				imgName: p.types[type],
				spriteScale: 0.1,
				spriteTint: type,
				textContent: name,
				boxAlpha: 0,
				onmouseup: function () {
					
				},
				onmouseupParam: undefined
			});
		}
		function addTplnodeCustomPositionGetters() {
			var b = boxSpriteText;
			
			function midX() {
				return b.x + (b.width / 2);
			}
			function midY() {
				return b.y + (b.height / 2);
			}
			Object.defineProperties(node, {
				"top": {
					get: function () { return b.y; }
				},
				"bott": {
					get: function () { return b.y + b.height; }
				},
				"left": {
					get: function () { return b.x; }
				},
				"right": {
					get: function () { return b.x + b.width; }
				},
				//--------------------------------------------------------
				"topLeft"  : {  get: function () { return pixi.coPoint( this.left  , this.top  ); }  },
				"topRight" : {  get: function () { return pixi.coPoint( this.right , this.top  ); }  },
				"bottLeft" : {  get: function () { return pixi.coPoint( this.left  , this.bott ); }  },
				"bottRight": {  get: function () { return pixi.coPoint( this.right , this.bott ); }  },
				"topMid"   : {  get: function () { return pixi.coPoint( midX()     , this.top  ); }  },
				"bottMid"  : {  get: function () { return pixi.coPoint( midX()     , this.bott ); }  },
				"leftMid"  : {  get: function () { return pixi.coPoint( this.left  , midY()    ); }  },
				"rightMid" : {  get: function () { return pixi.coPoint( this.right , midY()    ); }  },
				"center"   : {  get: function () { return pixi.coPoint( midX()     , midY()    ); }  }
			});
		}
		function createTplNode() {
			node = {};
			node.id = id;
			node.name = name;
			node.links = thisLinks;
			node.pixiEl = boxSpriteText;
			addTplnodeCustomPositionGetters();
		}
		function bringToFront(arr, el) {
			arr.splice( arr.indexOf(el), 1 );
			arr.push(el);
		}
		function addHandler() {
			
			boxSpriteText.setOnmousedown([node, p.links], function (e, node, tplLinks) {
				var links = node.links;
				
				popupManager.removeAll();
				
				bringToFront(
				//                nodeContainer
					pixi.viewport.children[1].children,
					boxSpriteText
				);
				
				if ( links ) {
					links.forEach(function (linkId) {
						var link = tplLinks[linkId];
						if (link) {
							link.pixiEl.clear();
						}
					});
				}
			});
			
			boxSpriteText.setOnmouseup([node, p.links, p.nodes], function (e, node, tplLinks, tplNodes) {
				var nodeId = node.id,
					links = node.links;
				
				
				/*
				var html = ''+
					'<table class="uk-table">'
				+		'<tr>'
				+			'<th>Node Name</th>'
				+			'<th>Node Id</th>'
				+		'</tr>'
				+		'<tr>'
				+			'<td>'+ name +'</td>'
				+			'<td>'+ id +'</td>'
				+	'</table>';
				popupManager.create(html, node.topLeft);
				*/
				
				
				if (links) {
					links.forEach(function (linkId) {
						var link = tplLinks[linkId],
							start, end;
						
						if (link) {
							if (link.src === nodeId) {
								start = node.center;
							}
							
							if (link.dest === nodeId) {
								end = node.center;
							}
							console.log(start, end);
							link.pixiEl.changePoints(start, end);
						}
					});
				}
				
			});
			
			boxSpriteText.setOnmousemove(undefined, function (e) {
				// var pos = e.data.global,
					// bubble = popupManager.activeBox,
					// pTop = bubble ? parseInt( bubble.css('top'), 10) : undefined,
					// pLeft = bubble ? parseInt( bubble.css('left'), 10) : undefined;
					
				// if (bubble) {
					// bubble.css('left', (pos.x - 40)+'px');
					// bubble.css('top', (pos.y - (bubble.height() + 40)) +'px');
				// }
			});
		}
		
		setThings();
		createBox();
		createTplNode();
		addHandler();
		
		p.nodes[ id ] = node;
		
		pixi.addChild(container, "nodeContainer", node.pixiEl);
		
		ani.fadeIn(node.pixiEl);
		
	}
	var createLink = (function () {
		var path = {},
			toggle = false;
		
		function create(start, end, srcId, destId, linkId, status, container) {
			var link, pixiEl, nth, curveLevel,
				srcdest, destsrc;
			
			srcdest = srcId + destId;
			destsrc = destId + srcId;
			link    = {};
			
			if ( !path[srcdest] && !path[destsrc] ) {
				path[srcdest] = 1;
			} else if ( path[srcdest] ) {
				path[srcdest] += 1;
			} else if ( path[destsrc] ) {
				path[destsrc] += 1;
			}
			
			nth = path[srcdest] || path[destsrc];
			curveLevel = (nth-1)*2;
			
			if (nth === 1) {
				pixiEl = pixi.create2pointLine({
					start: start,
					end: end,
					color: 0xCCAA00 * status,
					alpha: 0
				});
			} else if (nth > 1) {
				pixiEl = pixi.create3pointLine({
					start: start,
					end: end,
					color: 0xCCAA00 * status,
					curveLevel: curveLevel,
					curveSide: toggle ? false : true
				});
			}
			
			
			var setOndown = pixiEl.setOnmousedown;
			if ( u.isFn(setOndown) ) {
				setOndown(undefined, function () {
					//                     lineContainer
					var arr = pixi.viewport.children[0].children,
						el = pixiEl;
					
					arr.splice( arr.indexOf(el), 1 );
					arr.push(el);
				});
			}
			
			
			link.pixiEl = pixiEl;
			link.id = linkId;
			link.src = srcId;
			link.dest = destId;
			
			p.links[ linkId ] = link;
			
			
			pixi.addChild(container, "lineContainer", link.pixiEl);
			
			// animate(link.pixiEl);
			ani.fadeIn(pixiEl);
		}
		
		return create;
	}());
	function checkNode(node, container) {
		createNode( node, container );
	}
	function checkLink(link, container, bounds) {
		/*
		var src = link.src,
			dest = link.dest,
			b = bounds ? bounds : {},
			x1 = b.x1,
			x2 = b.x2,
			y1 = b.y1,
			y2 = b.y2,
			start, end,
			srcOut = false,
			destOut = false,
			nodes = p.nodes;
		
		if ( src.x > x1 &&
				src.x < x2 &&
				src.y > y1 &&
				src.y < y2 ) {
			start = nodes[src.id].center;
		} else {
			srcOut = true;
		}
		
		if ( dest.x > x1 &&
				dest.x < x2 &&
				dest.y > y1 &&
				dest.y < y2 ) {
			end = nodes[dest.id].center;
		} else {
			destOut = true;
		}
		
		if (srcOut) {
			start = calc();
		} else if (destOut) {
			end = calc();
		}
		*/
		// createLink(start, end, src.id, dest.id, link.id, container);
		
		var srcId, destId, srcNode, destNode, linkId,
			isObj = util.isObj,
			isStr = util.isStr;
		
		if (link.src) {
			if ( isObj(link.src) ) {
				srcId = link.src.id;
				
			} else if ( isStr(link.src) ) {
				srcId = link.src;
			}
		} else if (link.source_id) {
			srcId = link.source_id;
		}
		
		if (link.dest) {
			if ( isObj(link.dest) ) {
				destId = link.dest.id;
			} else if ( isStr(link.dest) ) {
				destId = link.dest;
			}
		} else if (link.destination_id) {
			destId = link.destination_id;
		}
		//debugger;
		srcNode = p.nodes[srcId];
		destNode = p.nodes[destId];
		//debugger;
		createLink(
			srcNode.center,
			destNode.center,
			srcId,
			destId,
			link.id,
			link.status,
			container
		);
	}
	function drawNodes(nodes, c, coefficient) {
		Object.keys(nodes).forEach(function (k) {
			// checkNode( nodes[k], c );
			createNode( nodes[k], c, coefficient );
		});
	}
	function drawLinks(links, c, b) {
		Object.keys(links).forEach(function (k) {
			checkLink( links[k], c, b );
		});
	}
	function draw(data, container, bounds, coefficient) {
		container = container ? container : "viewport";
		bounds = bounds ? bounds : {};
		coefficient = coefficient ? coefficient : false;
		
		p.nodes = {};
		p.links = {};
		drawNodes(data.nodes, container, coefficient);
		drawLinks(data.links, container, bounds);
	}
	
	return {
		get nodes() { return p.nodes },
		get links() { return p.links },
		checkLink: checkLink,
		draw: draw
	};
}());

var navigation = (function () {
	var inst = util.extend( newPubSub() ),
		p = {};
	
	function init() {
		var nav,
			panel,
			rect,
			dot;
		
		p.panel = new PIXI.Graphics();
		p.panelWidth = 400;
		p.panelHeight = 200;
		p.panelOffset = 100;
		panel = p.panel;
		panel.interactive = true;
		panel.beginFill(0xE3E3E3);
		panel.lineStyle(0);
		panel.drawRect(0, 0, p.panelWidth, p.panelHeight);
		panel.endFill();
		//panel.position.set( panelPos.x, panelPos.y ); 
		
		p.rect = new PIXI.Graphics();
		p.rectWidth = pixi.renderer.width / 10;
		p.rectHeight = pixi.renderer.height / 3;
		rect = p.rect;
		rect.interactive = true;
		rect.buttonMode = true;
		rect.beginFill(0x2196F3, 1);
		rect.lineStyle(0);
		rect.drawRect(0, 0, 150, 150);
		rect.endFill();
		rect.alpha = 0.5;
		rect.TPL_nav = "box";

		p.dot = new PIXI.Graphics();
		p.dotWH = 6;
		p.dotHalf = p.dotWH / 2;
		p.dotPos = {
			get x() { return (rect.x + rect.width) - p.dotHalf; },
			get y() { return (rect.y + rect.height) - p.dotHalf; }
		};
		dot = p.dot;
		dot.interactive = true;
		dot.buttonMode = true;
		dot.beginFill(0x0000FF, 1);
		dot.lineStyle(0);
		dot.drawRect(0, 0, p.dotWH, p.dotWH);
		dot.endFill();
		dot.position.set( p.dotPos.x, p.dotPos.y );
		dot.TPL_nav = "dot";
		
		p.nav = new PIXI.Container();
		p.navPos = new PIXI.Point(
			pixi.renderer.width - (p.panelWidth + p.panelOffset),
			50
		);
		nav = p.nav;
		nav.position.set( p.navPos.x, p.navPos.y );
		nav.addChild(panel);
		nav.addChild(rect);
		nav.addChild(dot);
		addDragDrop(panel, "panel");
		addDragDrop(rect, "rect");
		addDragDrop(dot, "dot");
		pixi.addChild("stage", nav);
	}
	function addDragDrop(el, name) {
		if (name === "rect") {
			el
				.on("mousedown", rectDown)
				.on("touchstart", rectDown)
				.on("mouseup", rectUp)
				.on("mouseupoutside", rectUp)
				.on("touchend", rectUp)
				.on("touchendoutside", rectUp)
				.on("mousemove", rectMove)
				.on("touchmove", rectMove);
		} else if ( name === "dot" ) {
			el
				.on("mousedown", dotDown)
				.on("touchstart", dotDown)
				.on("mouseup", dotUp)
				.on("mouseupoutside", dotUp)
				.on("touchend", dotUp)
				.on("touchendoutside", dotUp)
				.on("mousemove", dotMove)
				.on("touchmove", dotMove);
		}
	}
	function addCustomPos(el) {
		el.left = el.position.x;
		el.right = el.position.x + el.width;
		el.top = el.position.y;
		el.bott = el.position.y + el.height;
	}
	function panelDown(e) {
		//e.stopPropagation();
		
	}
	function panelUp() {
		
	}
	function panelMove() {
		
	}
	function rectDown(e) {
		this.data = e.data;
		this.dragging = true;
		this.dragPoint = e.data.getLocalPosition(this.parent);
		this.dragPoint.x -= this.position.x;
		this.dragPoint.y -= this.position.y;
	}
	function dotDown() {
		this.mouseIsDown = true;
	}
	function rectUp() {
		this.dragging = false;
		this.data = null;
	}
	function dotUp() {
		this.mouseIsDown = false;
	}
	function rectMove() {
		this.defaultCursor = "move";
		if (this.dragging) {
			var panel = p.panel,
				rect = p.rect,
				dot = p.dot,
				dotPos = p.dotPos,
				dotHalf = p.dotHalf,
				newPosition = this.data.getLocalPosition(this.parent),
				newX = newPosition.x - this.dragPoint.x,
				newY = newPosition.y - this.dragPoint.y,
				dotNewX = newX + (rect.width - dotHalf),
				dotNewY = newY + (rect.height - dotHalf);
				
			
			var min = 0,
				maxX = panel.width - rect.width,
				maxY = panel.height - rect.height,
				rectNewPos = new PIXI.Point(),
				dotNewPos = new PIXI.Point();
			
			if ( newX > min  &&  newX <= maxX ) {
				rectNewPos.x = newX
			} else if ( newX < min ) {
				rectNewPos.x = min;
			} else if ( newX > maxX ) {
				rectNewPos.x = maxX;
			}
			
			if ( newY > min  &&  newY <= maxY ) {
				rectNewPos.y = newY;
			} else if ( newY < min ) {
				rectNewPos.y = min;
			} else if ( newY > maxY ) {
				rectNewPos.y = maxY;
			}
			
			dotNewPos.x = ( newX > min  &&  newX <= maxX ) ? dotNewX : dotPos.x;
			dotNewPos.y = ( newY > min  &&  newY <= maxY ) ? dotNewY : dotPos.y;
			
			rect.position.x = rectNewPos.x;
			rect.position.y = rectNewPos.y;
			dot.position.x = dotNewPos.x;
			dot.position.y = dotNewPos.y;
			
			inst.publish("pan");
		}
	}
	function dotMove(e) {
		this.defaultCursor = "nwse-resize";
		if (this.mouseIsDown) {
			var currentCursor = e.data.getLocalPosition(this.parent),
				resizeX = ( currentCursor.x - this.x ),
				resizeY = ( currentCursor.y - this.y ),
				halfX = resizeX / 2,
				halfY = resizeY / 2,
				panel = p.panel,
				rect = p.rect,
				dot = p.dot;
				
			rect.defaultCursor = "nwse-resize";
			addCustomPos(rect);
			addCustomPos(panel);
			var	min = 0,
				nextRight = rect.width + resizeX,
				nextLeft = rect.position.x - halfX,
				nextBott = rect.height + resizeX,
				nextTop = rect.position.y - halfX,
				reachedRight = !(nextRight <= panel.right),
				reachedLeft = !(nextLeft > min),
				reachedBott = !(nextBott <= panel.bott),
				reachedTop = !(nextTop > min);
			
			if ( !reachedRight  &&  !reachedLeft ) {
				rect.width += resizeX;
				rect.position.x -= halfX;
				dot.position.x += halfX;
			} else if ( !reachedRight  &&  reachedLeft ) {
				rect.width += resizeX;
				dot.position.x += resizeX;
			}
			
			if ( !reachedBott  &&  !reachedTop ) {
				rect.height += resizeX;
				rect.position.y -= halfX;
				dot.position.y += halfX;
			} else if ( !reachedBott  &&  reachedTop ) {
				rect.height += resizeX;
				dot.position.y += resizeX;
			}
			inst.publish("zoom");
		}
	}
	
	inst.init = init;
	return inst;
}());

var wuk = (function () {
	
	function notify(o) {
		var v;
		
		v = UIkit.notification(o);
		
		return v;
	}
	
	return {
		notify: notify
	};
}());

var traceroute = (function () {
	var ws = {},
		path = 'ws://'+ baseRoot +'/network/icmp/traceroute', // window.location.host
		openCallback,
		coefficient = {},
		nodes = {},
		links = {},
		msgCounter = 0,
		noteMsgs = {},
		scanBtn = {};
	
	// var v = prompt('change the address if you want:', path);
	// if (v) { path = v;}
	
	function filter(data) {
		var newLinks = data.links,
			newNodes = data.nodes,
			diffNodes = {},
			diffLinks = {};
			
		Object.keys(newNodes).forEach(function (k) {
			if ( !nodes[k] ) {
				nodes[k] = newNodes[k];
				diffNodes[k] = newNodes[k];
			}
		});
		Object.keys(newLinks).forEach(function (k) {
			if ( !links[k] ) {
				links[k] = newLinks[k];
				diffLinks[k] = newLinks[k];
			}
		});
		
		return {
			links: diffLinks,
			nodes: diffNodes
		};
	}
	function abort() {
		if ( !u.isEmptyObj(ws) ) {
			ws.close(4999);
		}
	}
	function closeModal() {
		var u;
		// $('#newSide').toggle('slide');
		// $("body").trigger( $.Event("keydown", { keyCode: 27 }) );
		
		u = UIkit.modal('#modal-traceroute')[0];
		if ( u.isActive() ) {
			u.toggle('close');
		}
	}
	function closeSidebar() {
		var sb = $('#newSide')
		
		if ( sb.is(':visible') ) {
			sb.toggle('slide');
		}
	}
	function prepare() {
		pixi.clearContainer("viewport");
		pixi.mainContainer.x = pixi.renderer.width / 2;
		pixi.mainContainer.y = pixi.renderer.height / 2;
		
		closeModal();
		closeSidebar();
	}
	function onopen(e) {
		var cb = openCallback;
		
		console.log("Connection open...");
		
		noteMsgs.init.close();
		
		wuk.notify({
			message : '<i class="fa fa-check-circle fa-lg" aria-hidden="true"></i> Socket connected.',
			status  : 'success',
			timeout : 1000,
			pos     : 'bottom-right'
		});
		
		noteMsgs.processing = wuk.notify({
			message : '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i> Waiting for socket messages...',
			status  : 'info',
			timeout : 0,
			pos     : 'bottom-right'
		});
			
		// ws.send("Hello WebSocket!");
		
		if ( u.isFn(cb) ) {
			cb();
		}
	}
	function onmessage(e) {
		var data;
		msgCounter += 1;
			
		if (msgCounter === 1) { // first message
			prepare();
		}
		
		if ( u.isStr(e.data) ) {
			console.log("String message received\n");
			wuk.notify({
				message : '<i class="fa fa-check-circle fa-lg" aria-hidden="true"></i> New socket message received.',
				status  : 'success',
				timeout : 1000,
				pos     : 'bottom-right'
			});
			
			data = JSON.parse(e.data);
			console.log(data);
			
			data = filter(data);
			
			var nodesLen = Object.keys(data.nodes).length;
			var linksLen = Object.keys(data.links).length;
			
			console.log(nodesLen, linksLen);
			
			coefficient = {
				x: pixi.renderer.width / (300 + 80), // 600 80
				y: pixi.renderer.height / (300 + 80), // 600 80
			}
			// console.log(coefficient);
			
			a.tpl.draw(data, "viewport", undefined, coefficient);
			
		} else {
			console.log("Other message received\n", e.data);
		}
	}
	function onerror(e) {
		console.log("WebSocket Error: " , e);
		
		closeModal();
		
		noteMsgs.init.close();
		// noteMsgs.processing.close();
		wuk.notify({
			message : '<i class="fa fa-exclamation-triangle fa-lg" aria-hidden="true"></i> Socket error.',
			status  : 'danger',
			timeout : 2000,
			pos     : 'bottom-right'
		});
	}
	function onclose(e) {
		console.log("Connection closed", e);
		scanBtn.removeAttr('disabled');
		
		
		noteMsgs.init.close();
		noteMsgs.processing.close();
		wuk.notify({
			message : '<i class="fa fa-info-circle fa-lg" aria-hidden="true"></i> Socket closed.', // fa fa-check
			status  : 'info',
			timeout : 2000,
			pos     : 'bottom-right'
		});
	}
	function addHandlers(fn) {
		openCallback = fn;
		
		ws.onopen = onopen;
		ws.onmessage = onmessage;
		ws.onerror = onerror;
		ws.onclose = onclose;
	}
	function createSock(opt) {
		if (opt) { 
			path += '?portscanner=true';
		}
		ws = new WebSocket(path);
		console.log(ws);
	}
	function trace(arr, opt) {
		noteMsgs.init = wuk.notify({
			message : '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i> Opening socket...',
			status  : 'info',
			timeout : 0,
			pos     : 'top-center'
		});
		scanBtn = $('#traceroute-scan');
		scanBtn.attr('disabled', '');
		
		createSock(opt);
		addHandlers(function () {
			ws.send( JSON.stringify(arr) );
		});
		
	}
	
	return {
		abort: abort,
		trace: trace
		
	};
	
}());

var discovery = (function () {
	
	
	return {
		
		
	};
	
}());

var mediator = (function () {
	var inst = {},
		p = {};
	
	p.GLOBAL_BOUNDS = {
		X_1: -10000,
		X_2: 10000,
		Y_1: -6000,
		Y_2: 6000
	};
	p.data = {};    // unreversed for ajax data
	p.bounds = {};  // reversed to ease bound calculations
	p.width = 0;
	p.height = 0;
	p.counters = {
		xLeft:  0,
		xRight: 0,
		yUp:    0,
		yDown:  0
	};
	p.ajax;
	
	function loadData(container) {
		container = container ? container : "viewport";
		var abort = p.ajax ? p.ajax.xhr.abort : undefined;
		
		if (abort) {
			abort();
		}
		
		p.ajax = ajax({
			data: p.data
		})
		.done(function (data) {
			pixi.clearContainer(container || "viewport");
			tpl.draw(data, container || "viewport", p.bounds);
		});
	}
	function pixiCallback(width, height) {
		var w = width,
			h = height,
			hW = w / 2,
			hH = h / 2,
			b = p.bounds,
			d = p.data;
		p.width = w;
		p.height = h;
		
		// p.data.x1 = -hW;
		// p.data.x2 = w + hW;
		// p.data.y1 = -hH;
		// p.data.y2 = h + hH;
		
		d.x1 = 0;
		d.x2 = w;
		d.y1 = 0;
		d.y2 = h;
		
		// p.bounds.x1 = hW;
		// p.bounds.x2 = -hW;
		// p.bounds.y1 = hH;
		// p.bounds.y2 = -hH;
		
		b.xL = hW;
		b.xR = -hW;
		b.yU = hH;
		b.yD = -hH;
		
		console.log(p.bounds);
		console.log(p.data);
		ajax({
			data: p.data
		})
		.done(function ( data ) { // {url: "js/d.txt"}
			console.log(data);
			t = data;
			a.tpl.draw(data, "viewport");
		});
	}
	function panCallback(pos) {
		var x = Math.floor(pos.x),
			y = Math.floor(pos.y),
			b = p.bounds,
			d = p.data,
			w = p.width,
			h = p.height,
			hW = w / 2,
			hH = h / 2,
			c = p.counters,
			odd = util.isNumOdd,
			cnt;
		/*
		if (x >= b.xL) { // x1 512   x 0 1 2 3 4 5 6 7 8 9 (going left)
			c.xLeft += 1;
		
			
			
			b.xL += hW;
			b.xR += hW;
			
			d.x1 -= hW;
			d.x2 -= hW;
			
			console.log("salam");
			
			
			if ( odd(c.xLeft) ) { // 
				
				console.log("first");
				cnt = "xSec1";
			} else if ( !odd(c.xLeft) ) {
				
				console.log("second");
				cnt = "xSec2";
			}
			console.log(b);
			console.log(d);
			
			loadData(cnt);
		}
		
		if (x <= b.xR) { // x2 -512 x -1 -2 -3 -4 -5 -6 -7 (going right)
			
			console.log("chetori");
			b.xL -= hW;
			b.xR -= hW;
			
			d.x1 += hW;
			d.x2 += hW;
			
			console.log(b);
			console.log(d);
			loadData();
		}
		*/
		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		if (x >= b.xL) { // going left
			b.xL += hW;
			b.xR += hW;
			d.x1 -= hW;
			d.x2 -= hW;
			console.log("salam");
			console.log(b);
			console.log(d);
			loadData();
		}
		if (x <= b.xR) { // going right
			console.log("chetori");
			b.xL -= hW;
			b.xR -= hW;
			d.x1 += hW;
			d.x2 += hW;
			console.log(b);
			console.log(d);
			loadData();
		}
		
		if (y >= b.yU) { // going up
			b.yU += hH;
			b.yD += hH;
			d.y1 -= hH;
			d.y2 -= hH;
			console.log(b);
			console.log(d);
			loadData();
		}
		if (y <= b.yD) { // going down
			b.yU -= hH;
			b.yD -= hH;
			d.y1 += hH;
			d.y2 += hH;
			console.log(b);
			console.log(d);
			loadData();
		}
		
		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		/*
		if (x >= b.x1) { // x1 512   x 0 1 2 3 4 5 6 7 8 9 (going left)
			console.log("salam");
			b.x1 += hW;
			b.x2 -= hW;
			d.x1 -= hW;
			d.x2 -= hW;
			console.log(b);
			console.log(d);
			loadData();
		}
		
		if (x <= b.x2) { // x2 -512 x -1 -2 -3 -4 -5 -6 -7 (going right)
			console.log("chetori");
			b.x1 -= hW;
			b.x2 += hW;
			d.x1 += hW;
			d.x2 += hW;
			console.log(b);
			console.log(d);
			loadData();
		}
		
		if (y >= b.y1) { // y1 175   y1 10 20 30 (going up)
			console.log("here");
			b.y1 += hH;
			b.y2 += hH;
			d.y1 -= hH;
			d.y2 += hH;
			console.log(b);
			console.log(d);
			loadData();
		}
		
		if (y <= b.y2) { // y2 -175  y2 -10 -20 -30 (going down)
			console.log("kitty");
			b.y1 -= hH;
			b.y2 -= hH;
			d.y1 += hH;
			d.y2 += hH;		
			console.log(b);
			console.log(d);
			loadData();
		}
		*/
		// console.log(Math.floor(x), Math.floor(y)); 
	}
	function zoomCallback(d) {
		var pos = d.pos,
			x = pos.x,
			y = pos.y,
			b = p.bounds,
			xL = b.xL,
			xR = b.xR,
			yU = b.yU,
			yD = b.yD,
			w = p.width,
			h = p.height,
			hW = w / 2,
			hH = h / 2;
		
		// incX = aX > bX ? aX-bX : bX > aX ? bX-aX : undefined;
		// incY = aY > bY ? aY-bY : bY > aY ? bY-aY : undefined;
		// debugger;
		
		if (x >= xL) {
			b.xL = x+hW;
			b.xR = x-hW;
			
			console.log(b);
		}
		if (x <= xR) {
			
		}
		if (y >= yU) {
			
		}
		if (y <= yD) {
			
		}
		console.log(d.zoomIn);
		console.log(x, y);
		
	}
	function addCustomEvents() {
		
		pixi.on("pan", panCallback);
		pixi.on("zoom", zoomCallback);
		
		
		
		navigation.on("zoom", function () {
			console.log("zoom");
			pixi.zoom();
		});
		navigation.on("pan", function () {
			pixi.pan.pan(1, 1);
		});
	}
	function init() {
		pixi.init(pixiCallback, p.GLOBAL_BOUNDS);
		//core.init();
		//navigation.init();
		
		// addCustomEvents();
	}
	
	
	inst.data = p.data;
	inst.bounds = p.bounds;
	inst.init = init;
	
	return inst;
}());

var popupManager = (function () {
	var activeBox,
		cbX = {
			min: 0,
			max: 0
		},
		cbY = {
			min: 0,
			max: 0
		};
	
	function create(v, pos) {
		removeAll();
		var div = u.getCommentsInside('#bubble-template')[0].nodeValue.trim(),
			left, top;
			
		
		div = $(div);
		
		div.find('.bbl-content').html(v);
		$('#popups').append(div);
		
		if (pos) {
			div.css({
				left: 0,
				top: 0
			});
			left = (pos.x - 40)  + pixi.mainContainer.position.x + 'px';
			top = (pos.y - (div.height() + 40)) + pixi.mainContainer.position.y + 'px';
			div.css({
				left: left,
				top: top
			});
		}
		
		// console.log(div.css('top'), div.css('left'));
	}
	
	function removeAll() {
		$('#popups').empty();
	}
	
	return {
		get activeBox() { return $('#popups > .bubble'); },
		removeAll: removeAll,
		create: create
	};
}());

return {
	pixi: pixi,
	tpl: tpl,
	mediator: mediator,
	traceroute: traceroute,
	discovery: discovery,
	popupManager: popupManager
};
	

}());