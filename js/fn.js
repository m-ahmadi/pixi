var t,s;
var a = (function () {
"use strict";

var pixi = (function () {
	var inst = util.extend( coPubsub() ),
		p = {};
	
	p.renderer;
	p.stage;
	p.mainContainer;
	p.nodeContainer;
	p.lineContainer;
	p.textures;
	
	function init(callback, panBounds, background) {
		pan.setBounds(panBounds);
		PIXI.utils.skipHello();
		p.renderer = PIXI.autoDetectRenderer(
			window.innerWidth,
			window.innerHeight,
			{
				backgroundColor: background || 0xAB9999,
				antialias: true,
		//		resolution: false,
		//		transparent: false,
		//		preserveDrawingBuffer: false,
		//		view: HTMLCanvasElement
			}
		//	noWebGL: false,                    // optional
		);
		// document.body.appendChild( p.renderer.view );
		$('#contents').append( p.renderer.view );
		p.stage = new PIXI.Container();
		p.mainContainer = new PIXI.Container();
		p.lineContainer = new PIXI.Container();
		p.nodeContainer = new PIXI.Container();
		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		//p.stage.buttonMode = true;
		p.mainContainer.interactive = true;
		p.mainContainer.hitArea = new PIXI.Rectangle( -100000, -100000, p.renderer.width / p.renderer.resolution * 100000, p.renderer.height / p.renderer.resolution *100000 );
		pan.add( p.mainContainer );
			
		$(document).on('mousewheel', function (e) {
			// e.deltaX, e.deltaY, e.deltaFactor
			// zoom(e.pageX, e.pageY, e.deltaY > 0);
			// zoom(e);
			zoom(e.pageX, e.pageY, e.deltaY > 0);
		});
		
		p.mainContainer.addChild( p.lineContainer );
		p.mainContainer.addChild( p.nodeContainer );
		p.stage.addChild( p.mainContainer );
		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		requestAnimationFrame( animate );
		p.renderer.render( p.stage );
		
		
		
		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		/* var basePath = 'images/raw/edited/',
		images = [
			'computer', 'gamepad', 'hard-drive', 'imac-blue',
			'imac-grey', 'imac-red', 'ipad', 'iphone', 'macbook',
			'macintosh', 'monitor', 'playstation', 'smartphone',
			'smart-tv', 'smartwatch', 'tv-screen', 'video-card', 'xbox'
		];
		images.forEach(function (i) {
			var imgTrans = basePath+i+'-trans.png',
				imgFill = basePath+i+'-fill.png';
			PIXI.loader.add( imgTrans );
			PIXI.loader.add( imgFill );
		});
		PIXI.loader.load(); */
		
		PIXI.loader.add( 'images/computer.png' );
		PIXI.loader.add( 'images/hard.png' );
		PIXI.loader.add( 'images/atlas-0.json' );
		PIXI.loader.load(function () {
			p.textures = PIXI.loader.resources["images/atlas-0.json"].textures;
			callback(p.renderer.width, p.renderer.height);
		});
		//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		
		inst.publish('init');
	}
	
	function clear(k, opt) {
		p[k].destroy(opt);
		delete p[k];
		p[k] = new PIXI.Container();
		p.mainContainer.addChild( p[k] );
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
	var zoom = (function () {
		var direction;
		
		var getGraphCoordinates = (function () {
			var ctx = {
				global: {
					x: 0,
					y: 0
				} // store it inside closure to avoid GC pressure
			};

			return function (x, y) {
				ctx.global.x = x;
				ctx.global.y = y;
				return PIXI.interaction.InteractionData.prototype.getLocalPosition.call(ctx, p.mainContainer);
			};
		}());
		function zoom(x, y, isZoomIn) {
			var mainContainer = p.mainContainer;
			
			direction = isZoomIn ? 1 : -1;
			var factor = (1 + direction * 0.1);
			mainContainer.scale.x *= factor;
			mainContainer.scale.y *= factor;

			// Technically code below is not required, but helps to zoom on mouse
			// cursor, instead center of graphGraphics coordinates
			
			var beforeTransform = getGraphCoordinates(x, y);
			mainContainer.updateTransform();
			var afterTransform = getGraphCoordinates(x, y);

			mainContainer.position.x += (afterTransform.x - beforeTransform.x) * mainContainer.scale.x;
			mainContainer.position.y += (afterTransform.y - beforeTransform.y) * mainContainer.scale.y;
			mainContainer.updateTransform();
		}
		function zam( e ) {
			var factor = 1,
				delta = e.deltaY,
				local_pt = new PIXI.Point(),
				point = new PIXI.Point(e.pageX, e.pageY),
				mainContainer = p.mainContainer;

			PIXI.interaction.InteractionData.prototype.getLocalPosition(mainContainer, local_pt, point);

			if ( delta > 0 ) {
				// Zoom in
				factor = 1.1;
			} else {
				// Zoom out
				factor = 1 / 1.1;
			}

			mainContainer.pivot = local_pt;
			mainContainer.position = point;
			mainContainer.scale.set(mainContainer.scale.x * factor);
		}
		function zoomba(x, y, isZoomIn) {
			var direction = (isZoomIn) ? 1 : -1,
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
		
		return zoomba;
	}());
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
			
			if (mcX <= bX1    &&    mcX >= bX2) {
				p.mainContainer.position.x += dx;
			} else {
				p.mainContainer.position.x = mcX > 0 ? bX1 : mcX < 0 ? bX2 : undefined;
			}
			
			if (mcY <= bY1    &&    mcY >= bY2) {
				p.mainContainer.position.y += dy;
			} else {
				p.mainContainer.position.y = mcY > 0 ? bY1 : mcY < 0 ? bY2 : undefined;
			}
			
			
			
			prevX = pos.x;
			prevY = pos.y;
			
			inst.publish('pan', p.mainContainer.position);
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
				.on('mousedown', down)
				.on('touchstart', down)
				.on('mouseup', up)
				.on('mouseupoutside', up)
				.on('touchend', up)
				.on('touchendoutside', up)
				.on('mousemove', move)
				.on('touchmove', move);
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
	var addDragDrop = (function () {
		function down(e) {
			e.stopPropagation();
			this.data = e.data;
			this.alpha = 0.5;
			this.dragging = true;
			this.dragPoint = e.data.getLocalPosition(this.parent);
			this.dragPoint.x -= this.position.x;
			this.dragPoint.y -= this.position.y;
			
			bringToFront(this);
		}
		function up() {
			this.alpha = 1;
			this.dragging = false;
			this.data = null;
			
			if ( this.TPL_Stuff  &&  this.TPL_Stuff.links ) {
				core.adjustLines(this);
			}
		}
		function move() {
			if ( this.dragging ) {
				var newPosition = this.data.getLocalPosition(this.parent);
				this.position.x = newPosition.x - this.dragPoint.x;
				this.position.y = newPosition.y - this.dragPoint.y;
			}
		}
		
		function add(el) {
			el
				.on('mousedown', down) 
				.on('touchstart', down)
				.on('mouseup', up)
				.on('mouseupoutside', up)
				.on('touchend', up)
				.on('touchendoutside', up)
				.on('mousemove', move)
				.on('touchmove', move);
		}
		
		
		return add;
	}());
	function create2pointLine(conf) {
		conf = conf ? conf : {};
		
		var line,
			start,
			end,
			lineWidth,
			color,
			p;
		
		function setThings() {
			start     =  conf.start     ||  {x: 0, y: 0},
			end       =  conf.end       ||  {x: 0, y: 0},
			lineWidth =  conf.lineWidth ||  2,
			color     =  conf.color     ||  0x000000;
			p = calcPoints(start, end, lineWidth);
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
		}
		function up() {
			this.alpha = 1;
		}
		function move() {
			//console.log('move');
		}
		function addEvents() {
			line
				.on('mousedown', down) 
				.on('touchstart', down)
				.on('mouseup', up)
				.on('mouseupoutside', up)
				.on('touchend', up)
				.on('touchendoutside', up)
				.on('mousemove', move)
				.on('touchmove', move);
		}
		function toggleDirties() {
			var dirty = line.dirty,
				clearDirty = line.clearDirty;
			
			dirty = (dirty) ? false : true;
			clearDirty = (clearDirty) ? false : true;
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
			p = calcPoints(start, end, lineWidth);
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
		line.changePoints = changePoints;
		line.changeColor = changeColor;
		Object.defineProperty(line, 'points', {
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
		
		p.mainContainer.addChild(line);
		return line;
	}
	function createBoxSpriteText(conf) {
		conf = conf ? conf : {};
		var sprite,
			text,
			box,
			imgFill, imgBasePath, imgName, imgExt, img,
			spriteImg, spriteScale,
			textContent, textFont, textSize, textColor,
			boxX, boxY,
			onmouseup, onmouseupParam;
		
		function setThings() {
			imgFill     = conf.imgFill      || false;
			imgBasePath = conf.imgBasePath  || 'images/raw/edited/'; // images/
			imgName     = conf.imgName      || 'tv-screen'; // tv-screen computer
			imgExt      = conf.imgExt       || '.png';
			spriteScale = conf.spriteScale  || 0.2;
			textContent = conf.textContent  || 'no_name';
			textFont    = conf.textFont     || 'Arial';
			textSize    = conf.textSize     || '16px';
			textColor   = conf.textColor    || 'black';
			boxX        = conf.x            || 0;
			boxY        = conf.y            || 0;
			// spriteImg   = conf.spriteImg    || imgBasePath + imgName + (imgFill ? '-fill':'-trans') + imgExt;
			spriteImg   = conf.spriteImg    || imgName + (imgFill ? '-fill':'-trans') + imgExt;
		}
		function down(e) {
			e.stopPropagation();
			this.data = e.data;
			this.alpha = 0.5;
			this.dragging = true;
			this.dragPoint = e.data.getLocalPosition(this.parent);
			this.dragPoint.x -= this.position.x;
			this.dragPoint.y -= this.position.y;
			
			//bringToFront(this);
		}
		function up() {
			this.alpha = 1;
			this.dragging = false;
			this.data = null;
			if ( util.isFunc(onmouseup) ) {
				onmouseup.apply(undefined, onmouseupParam);
			}
		}
		function move() {
			if ( this.dragging ) {
				var newPosition = this.data.getLocalPosition(this.parent);
				this.position.x = newPosition.x - this.dragPoint.x;
				this.position.y = newPosition.y - this.dragPoint.y;
			}
		}
		function addEvents(el) {
			el
				.on('mousedown', down) 
				.on('touchstart', down)
				.on('mouseup', up)
				.on('mouseupoutside', up)
				.on('touchend', up)
				.on('touchendoutside', up)
				.on('mousemove', move)
				.on('touchmove', move);
		}
		function makeSprite() {
			// sprite = new PIXI.Sprite.fromImage( spriteImg );
			sprite = new PIXI.Sprite( p.textures[spriteImg] );
			sprite.interactive = true;
			sprite.buttonMode = true;
			sprite.anchor.set(0, 0);
			sprite.alpha = 1;
			sprite.scale.set( spriteScale );
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
			box.alpha = 1;
			box.position.x = boxX;
			box.position.y = boxY;
			box.hitArea = new PIXI.Rectangle(0, 0, sprite.width, sprite.height);
			addEvents(box);
			box.addChild(sprite); 
			box.addChild(text);
			addChild('stage', box);
		}
		
		setThings();
		makeSprite();
		makeText();
		makeBox();
		
		box.setOnmouseup = function (param, fn) {
			onmouseupParam = param;
			onmouseup = fn;
		}
		return box;
	}
	function bringToFront(el) {
		// reorder children for z-index
		var arr = p.mainContainer.children;
		arr.splice( arr.indexOf(el), 1 );
		arr.push(el);
	}
	function createSprite(o, noDrag) {
		// var sprite = new PIXI.Sprite.fromImage(o.image);
		var sprite = new PIXI.Sprite( PIXI.TextureCache[o.image] );
		sprite.interactive = true;
		sprite.buttonMode = true;
		sprite.anchor.set(0, 0);
		sprite.scale.set(o.scale);
		sprite.alpha = o.alpha || 0;
		sprite.rotation = o.rotation || 0;
		sprite.position.x = o.x;
		sprite.position.y = o.y;
		
		if ( !noDrag ) {
			addDragDrop(sprite);
		}
		
		return sprite;
	}
	function createLine(conf, noDrag) {
		var line = new PIXI.Graphics(),
			points,
			i;
		
		if (!conf) { var conf = {}; }
		if ( util.isObj(conf) ) {
			points = conf.points || [];
		} else if ( util.isArr(conf) ) {
			points = conf;
		}
		
		
		if ( points.length === 0 ) {
			points = [0, 0, 1, 1];
		}
		
		
		line.interactive = true;
		line.buttonMode = true;
		line.beginFill();
		line.lineStyle(
			conf.thickness || 2,
			conf.color || 0x000000,
			conf.alpha || 1
		);
		
		line.moveTo( points[0], points[1] );
		for (i=2; i < points.length ;i+=2) {
			line.lineTo( points[i], points[i+1] );
		}
		line.lineTo( points[0], points[1] );
		line.endFill();
		line.hitArea = new PIXI.Polygon([
			
		]);
		
		if ( !noDrag ) {
			addDragDrop(line);
		}
		
		return line;
	}
	function redrawLine(ctx, o) {
		var points,
			i,
			dirty,
			clearDirty;
		
		if ( util.isObj(o) ) {
			points = o.points;
		} else if ( util.isArr(o) ) {
			points = o;
		}
		
		ctx.clear();
		ctx.beginFill();
		ctx.lineStyle(
			o.thickness || 2,
			o.color     || 0x000000,
			o.alpha     || 1
		);
		
		ctx.moveTo( points[0], points[1] );
		for (i=2; i < points.length ;i+=2) {
			ctx.lineTo( points[i], points[i+1] );
		}
		ctx.lineTo( points[0], points[1] );
		ctx.endFill();
		
		
		dirty = ctx.dirty;
		clearDirty = ctx.clearDirty;
		
		if ( dirty ) {
			dirty = false
		} else if ( !dirty ) {
			dirty = true;
		}
		
		if ( clearDirty ) {
			clearDirty = false
		} else if ( !clearDirty ) {
			clearDirty = true;
		}
		
	}
	function createRect(o, noDrag) {
		var rect = new PIXI.Graphics();
		
		rect.interactive = true;
		rect.buttonMode = true;
		rect.beginFill(o.color);
		rect.lineStyle(
			o.lineWidth || 0,
			o.lineColor || 0x000000,
			o.alpha || 1
		);
		rect.drawRect(
			o.x || 0,
			o.y || 0,
			o.width,
			o.height
		);
		rect.endFill();
		
		if ( !noDrag ) {
			addDragDrop(rect);
		}
		
		return rect;
	}
	function createText(o, noDrag) {
		if ( !o ) {	var o = {}; }
		var txt = util.isStr( o ) ? o : o.text;
		
		var text = new PIXI.Text(txt, {
			fontFamily: o.font || 'Arial',
			fontSize: o.size || '20px',
			fill: o.color || 'black'
		});
		text.interactive = true;
		text.buttonMode = true;
		
		if ( !noDrag ) {
			addDragDrop(text);
		}
		
		return text;
	}
	function addChild(where, child) {
		p[where].addChild(child);
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
		"nodeContainer": {
			get: function () { return p.nodeContainer; }
		},
		"lineContainer": {
			get: function () { return p.lineContainer; }
		},
		"textures": {
			get: function () { return p.textures; }
		}
	});
	inst.init = init;
	inst.clear = clear;
	inst.animate = animate;
	inst.coPoint = coPoint;
	inst.addDragDrop = addDragDrop;
	inst.createSprite = createSprite;
	inst.create2pointLine = create2pointLine;
	inst.create3pointLine = create3pointLine;
	inst.createBoxSpriteText = createBoxSpriteText;
	inst.createLine = createLine;
	inst.redrawLine = redrawLine;
	inst.createRect = createRect;
	inst.createText = createText;
	inst.zoom = zoom;
	inst.pan = pan;
	inst.addChild = addChild;
	inst.bringToFront = bringToFront;
	
	return inst;
}());


var tpl = (function () {
	var p = {};
		
	p.nodes = {};
	p.links = {};
	p.idCounter = 0;
	p.types = [
		'tv-screen', 'macintosh', 'imac-blue', 'smart-tv', 'imac-red',
		'imac-grey', 'monitor', 'ipad', 'iphone', 'macbook',
		'computer', 'gamepad', 'playstation', 'hard-drive',
		'smartphone', 'smartwatch', 'video-card', 'xbox'
	];
	
	
	function animateNode(pixiEl, o) {
		o = o ? o : {};
		var box = pixiEl;
		
		TweenLite.to(box, 0.3, {
			alpha: 1,
			yoyo: true,
			ease: Linear.easeInOut
		});

		TweenLite.to(box.scale, 0.3, {
			x: 1,
			y: 1,
			yoyo: true,
			ease: Linear.easeInOut,
			onComplete: o.done,
			onCompleteParams: o.doneParams,
			onCompleteScope: o.doneCtx
		});
	}
	function PREV_STYLE_createNode(conf) {
		if ( !conf ) { var conf = {}; }
		
		var node, links, hasLinks,
			nodeImg, name, id,
			line,
			x, y,
			boxSpriteText;
		
		function setThings() {
			node     = {};
			hasLinks = false;
			nodeImg  = conf.type; //image filename in './images/' (without extention)
			name     = conf.name;
			links    = conf.links;
			id       = conf.id   || 'tpl_node_'+(p.idCounter+=1);
			x        = conf.x;
			y        = conf.y
		}
		function handleLinks() {
			if ( links  &&  util.isArr( links )  &&  links.length ) {
				createLink();
			} else {
				node.links = false;
			}
		}
		function createLink() {
			node.links = {};
			node.linkCount = links.length;
			links.forEach(function (nodeIdStr) {
				var target = p.nodes[nodeIdStr]; // nodes["device_14"]
				// line = pixi.createLine();
				line = pixi.create2pointLine();
				if ( !target.links ) {
					target.links = {};
				}
				target.links[ node.id ] = {};
				target.links[ node.id ].line = line;
				target.linkCount = util.objLength( target.links );
				node.links[nodeIdStr] = {};
				node.links[nodeIdStr].line = line;
				pixi.addChild('mainContainer', line);
			});
		}
		function create() {
			boxSpriteText = pixi.createBoxSpriteText({
				spriteImg: nodeImg,
				spriteScale: 0.2,
				textContent: name,
				x: x,
				y: y,
				onmouseup: function (pixiEl) {
					adjustLines(pixiEl);
				}
			});
			node.name = name;
			node.id = id;
			node.pixiEl = boxSpriteText;
		}
		
		setThings();
		create();
		handleLinks();
		
		p.nodes[ id ] = node;
		pixi.addChild('mainContainer', node.pixiEl);
		//adjustLines(node.pixiEl);
		animateNode(node.pixiEl, {
			done: adjustLines,
			doneParams: [node.pixiEl]
		});
			
		return node;
	}
	function createNode(o, fill) {
		o = o ? o : {};
		
		var node,
			type, name, id, thisLinks,
			x, y,
			boxSpriteText;
		
		function setThings() {
			type      = o.type  || 0;
			id        = o.id    || 'tpl_node_'+(p.idCounter+=1);
			name      = o.name  || 'Node '+(p.idCounter+=1);
			x         = o.x;
			y         = o.y;
			thisLinks = o.links || false;
			
		}
		function createBox() {
			boxSpriteText = pixi.createBoxSpriteText({
				x: x,
				y: y,
				imgName: p.types[type],
				imgFill: fill,
				spriteScale: 0.1,
				textContent: name,
				onmouseup: function () {
					
				},
				onmouseupParam: undefined
			});
		}
		function addTplnodeCustomPositionGetters(o) {
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
			addTplnodeCustomPositionGetters(opt);
		}
		function addHandler() {
			/*
			boxSpriteText.setOnmousedown(function () {
				// clear line
			};
			*/
			
			boxSpriteText.setOnmouseup([node, p.links, p.nodes], function (node, tplLinks, tplNodes) {
				var nodeId = node.id;
				
				node.links.forEach(function (linkId) {
					var link = tplLinks[linkId],
						start, end;
						
					if (link.src === nodeId) {
						start = node.center;
					}
					
					if (link.dest === nodeId) {
						end = node.center;
					}
					
					link.pixiEl.changePoints(start, end);
					
				});
			});
		}
		
		setThings();
		createBox();
		createTplNode();
		addHandler();
		
		p.nodes[ id ] = node;
		pixi.addChild('nodeContainer', node.pixiEl);
	}
	function twoNodesLinkCount(firstNode, secondNode, dataLinks) {
		var firstId = firstNode.id,
			secondId = secondNode.id,
			count = 0,
			arr = [];
		
		firstNode.links.forEach(function (i) {
			var link = dataLinks[i],
				linkId;
			
			if (link.src === secondId  ||  link.dest === secondId) {
				count += 1;
				arr.push(link.id);
			}
		});
		
		return arr;
	}
	var createLink = (function () {
		var path = {},
			toggle = false;
		
		function create(o) {
			debugger;
			var link = {},
				pixiEl,
				srcNode = p.nodes[o.src],
				destNode = p.nodes[o.dest],
				srcCenter = srcNode.center,
				destCenter = destNode.center,
				id = o.id,
				srcdest = o.src + o.dest,
				destsrc = o.dest + o.src,
				nth, curveLevel;
			
			//console.log(o.src + o.dest, o.dest + o.src);
			
			if ( !path[srcdest] && !path[destsrc] ) {
				path[srcdest] = 1;
			} else if ( path[srcdest] ) {
				path[srcdest] += 1;
			} else if ( path[destsrc] ) {
				path[destsrc] += 1;
			}
			
			nth = path[srcdest] || path[destsrc];
			curveLevel = (nth-1)*2;
			//debugger;
			if (nth === 1) {
				//debugger;
				pixiEl = pixi.create2pointLine({
					start: srcCenter,
					end: destCenter
				});
			} else if (nth > 1) {
				//debugger;
				pixiEl = pixi.create3pointLine({
					start: srcCenter,
					end: destCenter,
					curveLevel: curveLevel
					//curveSide: toggle ? false : true
				});
			}
			
			link.pixiEl = pixiEl;
			link.id = id;
			link.src = o.src;
			link.dest = o.dest;
			
			p.links[ id ] = link;
			pixi.addChild('lineContainer', link.pixiEl);
			// if (nth > 1) {
				// console.log(srcCenter, destCenter);
				// throw new Error();
			// }
			return path;
		}
		
		return create;
	}());
	function drawNodes(nodes, fill) {
		Object.keys(nodes).forEach(function (k) {
			createNode( nodes[k], fill );
		});
	}
	function drawLinks(links) {
		Object.keys(links).forEach(function (k) {
			createLink( links[k] );
		});
	}
	/*
	function createLink(o) {
			var link = {},
				pixiEl,
				srcNode = p.nodes[o.src],
				destNode = p.nodes[o.dest],
				id = o.id;
			
			pixiEl = pixi.create2pointLine({
				start: srcNode.center,
				end: destNode.center
			});
			
			link.pixiEl = pixiEl;
			link.id = id;
			link.src = o.src;
			link.dest = o.dest;
			
			p.links[ id ] = link;
			pixi.addChild('lineContainer', link.pixiEl);
		}
		
		return create;
	}
	function createLinkSameHelper(sames) {
		var toggle = false,
			curveLevel = 0,
			curveSide = false;
		
		
		if ( util.isNumOdd(sames.length) ) { // odd
			
			
			
		} else { // even
			
		}
		sames.forEach(function (idx, k) {
			var link = links[k];
			
			if (idx === 0) {
				curveLevel += 0;
			} else if (idx > 0) {
				curveLevel += 1;
				if (toggle) {
					curveSide = true;
					toggle = false;
				} else {
					curveSide = false;
					toggle = true;
				}
			}
			createLinkSame(link, curveLevel, curveSide);
			delete links[k];
		});
	}
	function createLinkSame(o, curveLevel, curveSide) {
		var link = {},
			pixiEl,
			srcNode = p.nodes[o.src],
			destNode = p.nodes[o.dest],
			id = o.id;
		
		pixiEl = pixi.create3pointLine({
			start: srcNode.center,
			end: destNode.center,
			curveLevel: curveLevel,
			curveSide: curveSide
		});	
			
		link.pixiEl = pixiEl;
		link.id = id;
		link.src = o.src;
		link.dest = o.dest;
		
		p.links[ id ] = link;
		pixi.addChild('lineContainer', link.pixiEl);
	}
	function drawLinks(links, nodes) {
		
		Object.keys(links).forEach(function (k) {
			var link,
				srcNode, destNode,
				sames, len,
				curveLevel = 0,
				curveSide = false;
				
			link = links[k];
			if (!link) { return; }
			srcNode = nodes[link.src];
			destNode = nodes[link.dest];
			if (!srcNode || !destNode) { return; }
			
			sames = twoNodesLinkCount(srcNode, destNode, links);
			len = sames.length;
			console.log(sames);
			
			if (len === 1) {
				createLink( link );
				
			} else if (len > 1) {
				
				if ( util.isNumOdd(len) ) { // odd
					
					sames.forEach(function (k, idx) {
						var link = links[k];
						if (idx === 0) {
							curveLevel += 0;
						} else if (idx > 0) {
							curveLevel += 2;
							curveSide = curveSide ? false : true;
						}
						createLinkSame(link, curveLevel, curveSide);
						delete links[k];
					});
					curveLevel = 0;
				} else { // even
					sames.forEach(function (k, idx) {
						var link = links[k];
						curveLevel += 2;
						curveSide = curveSide ? false : true;
						createLinkSame(link, curveLevel, curveSide);
						delete links[k];
					});
					curveLevel = 0;
				}
				
				
				
			}
		});
	}
	*/
	function draw(data) {
		drawNodes(data.nodes);
		drawLinks(data.links);
	}
	function generateJson(nodeCount, m, e) {
		var o = {
				nodes: {},
				links: {}
			},
			counter = 0,
			mul = m ? m : 1,
			e = e ? e : 10,
			i;
		
		var arr = [
			'tv-screen', 'computer', 'gamepad', 'hard-drive', 'imac-blue',
			'imac-grey', 'imac-red', 'ipad', 'iphone', 'macbook',
			'macintosh', 'monitor', 'playstation', 'smartphone',
			'smart-tv', 'smartwatch', 'video-card', 'xbox'
		];
		var typeIndex = -1;
		
		for (i=0; i<nodeCount; i+=1) {
			var id = 'node_'+(counter+=1),
				n = {};
			
			n.id = id;
			n.x = Math.random() * pixi.renderer.width *mul;
			n.y = Math.random() * pixi.renderer.height *mul;
			n.links = [];
			
			
			var each = e;
			
			if ( i % each === 0 ) {
				typeIndex += 1;
			}
			if (typeIndex === arr.length-1) {
				typeIndex = 0;
			}
			
			n.type = typeIndex;
			o.nodes[id] = n;
		}
		counter = 0;
		for (i=0; i<nodeCount; i+=1) {
			var id = 'link_'+(counter+=1),
				srcNode = o.nodes['node_'+(i+1)],
				destNode = o.nodes['node_'+(i+2)],
				src = srcNode ? srcNode.id : 'node_1',
				dest = destNode ? destNode.id : 'node_1';
			
			var link = {
				id: id,
				src: src,
				dest: dest
			};
			
			Object.keys(o.nodes).forEach(function (k) {
				var node = o.nodes[k];
				if (node.id === link.src ||
						node.id === link.dest) {
					node.links.push(link.id);
				}
			});
			o.links[id] = link;
		}
		
		return o;
	}
	function test(c, m, color, each, fill) {
		
		var data = generateJson(c, m, each);
		drawNodes(data.nodes, fill);
		drawLinks(data.links, color);
		
		
		/*
		var count = 0;
		var arr = [];
		Object.keys(o).forEach(function (key) {
			var t = o[key];
			if ( t.src === str || t.dest === str ) {
				count += 1;
				arr.push(t.id);
			}
			
		});
		
		return arr;
		*/
	}
	
	return {
		//createLinkSame: createLinkSame,
		//twoNodesLinkCount: twoNodesLinkCount,
		createLink: createLink,
		test: test,
		nodes: p.nodes,
		links: p.links,
		generateJson : generateJson,
		drawNodes: drawNodes,
		drawLinks: drawLinks,
		draw: draw
	};
}());
var core = (function () {
	var inst = util.extend( coPubsub() ),
	tplNodes = {},
	idCounter = 0; // createTplNode uses this
	t = function () { return tplNodes; }; // testing purposes
	
	var
	animateNode = function (element, o) {
		if ( !o ) { var o = {}; }
		var box = element;
		
		TweenLite.to(box, 0.3, {
			alpha: 1,
			yoyo: true,
			ease: Linear.easeInOut
		});

		TweenLite.to(box.scale, 0.3, {
			x: 1,
			y: 1,
			yoyo: true,
			ease: Linear.easeInOut,
			onComplete: o.done,
			onCompleteParams: o.doneParams,
			onCompleteScope: o.doneCtx
		});
	},
	adjustLine = function (line, points) {
		line.changePoints({
			x: points[0],
			y: points[1]
		}, {
			x: points[2],
			y: points[3]
		});
		/*
		pixi.redrawLine(line, {
			points: points
		});
		*/
	},
	getNodeInfo = function (node) {
		/*	node: A sprite or a graphics object, or a link object
			return: An object containing only required information about the node. */
		var x = node.x,
			y = node.y,
			width = node.width,
			height = node.height,
			pos = {},
			result = {};
		
		result.linkCount = node.linkCount || node.TPL_linkCount;
		
		pos.left = x;
		pos.right = x + width;
		pos.top = y;
		pos.bottom = y + height;
		
		pos.midLeft = {
			x: x,
			y: y + (height / 2)
		}
		pos.midRight = {
			x: x + width,
			y: y + (height / 2)
		};
		pos.midTop = {
			x: x + (width / 2),
			y: y
		};
		pos.midBott = {
			x: x + (width / 2),
			y: y + height
		};
		
		pos.topLeft = {
			x: x,
			y: y
		};
		pos.topRight = {
			x: x + width,
			y: y
		};
		pos.bottomLeft = {
			x: x,
			y: y + height
		};
		pos.bottomRight = {
			x: x + width,
			y: y + height
		};
		
		result.pos = pos;
		
		return result;
	},
	getOneLinkRelativePosition = function (source, target) {
		// where is this link point in relation to the current node
		// target: one of the links of the dragged node
		var rel = {};
		rel.farLeft = false;
		rel.farRight = false;
		rel.midLeft = false;
		rel.midRight = false;
		rel.farUp = false;
		rel.farDown = false;
		rel.midUp = false;
		rel.midDown = false;
		rel.sameX = false;
		rel.sameY = false;
		
		if ( target.right < source.left ) { // farLeft
			rel.farLeft = true;
		} else if ( target.left > source.right ) { // farRight
			rel.farRight = true;
		} else if ( target.left < source.left &&
				target.right > source.left ) { // midLeft
			rel.midLeft = true;
		} else if ( target.left < source.right &&
				target.right > source.right ) { // midRight
			rel.midRight = true;
		} else if ( target.left === source.left ) {
			rel.sameX = true;
		}
		
		if ( target.bottom < source.top ) { // farUp
			rel.farUp = true;
		} else if ( target.top > source.bottom ) { // farDown
			rel.farDown = true;
		} else if ( target.bottom > source.top &&
				target.top < source.top ) { // midUp
			rel.midUp = true;
		} else if ( target.bottom > source.top &&
				target.top > source.top ) { // midDown
			rel.midDown = true;
		} else if ( target.top === source.top ) {
			rel.sameY = true;
		}
		
		target.rel = rel;
		return target;
	},
	calcDistance = function (x, y) {
		var distance = {},
			distX,
			distY;
		
		distX = x.bigX - x.smallX;
		distY = y.bigY - y.smallY;
		
		if ( distX > distY ) {
			
			distance.largerX = true;
			
		} else if ( distY > distX ) {
			
			distance.largerY = true;
			
		} else if ( distX === distY ) {
			
			distance.equalXY = true;
			
		}
		
		distance.x = distX;
		distance.y = distY;
		
		return distance;
	},
	calcLinkPoints = function (node) {
		var points = [],
			source = getNodeInfo(node),
			links = node.TPL_Stuff.links,
			srcTplNodeId = node.TPL_Stuff.id;
			
		Object.keys( links ).forEach(function (keyStr) {
			var tplNode = tplNodes[keyStr],
				link = tplNode.node,
				target,
				srcPos,
				trgPos,
				rel,
				dist,
				frm,
				to;
				
			target = getNodeInfo(link);
			srcPos = source.pos;
			trgPos = target.pos
			target = getOneLinkRelativePosition(srcPos, trgPos);
			rel = target.rel;
			
			if ( rel.farUp  &&  rel.farLeft ) {
				dist = calcDistance({
					bigX: srcPos.left,
					smallX: trgPos.right
				}, {
					bigY: srcPos.top,
					smallY: trgPos.bottom
				});
				
				if ( dist.largerX ) {
					frm = srcPos.midLeft;
					to = trgPos.midRight;
				} else if ( dist.largerY ) {
					frm = srcPos.midTop;
					to = trgPos.midBott;
				} else if ( dist.equalXY ) {
					frm = srcPos.topLeft;
					to = trgPos.bottomRight;
				}
			} else if ( rel.farUp  &&  rel.farRight ) {
				dist = calcDistance({
					bigX: trgPos.left,
					smallX: srcPos.right
				}, {
					bigY: srcPos.bottom,
					smallY: trgPos.top
				});
				
				if ( dist.largerX ) {
					frm = srcPos.midRight;
					to = trgPos.midLeft;
				} else if ( dist.largerY ) {
					frm = srcPos.midTop;
					to = trgPos.midBott;
				} else if ( dist.equalXY ) {
					frm = srcPos.topRight;
					to = trgPos.bottomLeft;
				}
			} else if ( rel.farDown  &&  rel.farLeft ) {
				dist = calcDistance({
					bigX: srcPos.left,
					smallX: trgPos.right
				}, {
					bigY: trgPos.top,
					smallY: srcPos.bottom
				});
				
				if ( dist.largerX ) {
					frm = srcPos.midLeft;
					to = trgPos.midRight;
				} else if ( dist.largerY ) {
					frm = srcPos.midBott;
					to = trgPos.midTop;
				} else if ( dist.equalXY ) {
					frm = srcPos.bottomLeft;
					to = trgPos.topRight;
				}
			} else if ( rel.farDown  &&  rel.farRight ) {
				dist = calcDistance({
					bigX: trgPos.left,
					smallX: srcPos.right
				}, {
					bigY: trgPos.top,
					smallY: srcPos.bottom
				});
				
				if ( dist.largerX ) {
					frm = srcPos.midRight;
					to = trgPos.midLeft;
				} else if ( dist.largerY ) {
					frm = srcPos.midBott;
					to = trgPos.midTop;
				} else if ( dist.equalXY ) {
					frm = srcPos.bottomRight;
					to = trgPos.topLeft;
				}
			}
			
			if ( rel.midLeft  ||  rel.midRight ) {
				if ( rel.farUp ) {
					frm = srcPos.midTop;
					to = trgPos.midBott;
					
				} else if ( rel.farDown ) {
					frm = srcPos.midBott;
					to = trgPos.midTop;
				}
			}
			
			if ( rel.midUp  ||  rel.midDown ) {
				if ( rel.farLeft ) {
					frm = srcPos.midLeft;
					to = trgPos.midRight;
				} else if ( rel.farRight ) {
					frm = srcPos.midRight;
					to = trgPos.midLeft;
				}
			}
			
			if (  !( (rel.midLeft || rel.midRight) &&
					(rel.midUp || rel.midDown) )  ) {
				
				points.push({
					line: tplNode.links[srcTplNodeId].line,
					ferom: frm,
					to: to
				});
			
			}
			
			
			
		});
		
		
		return points;
	},
	adjustLines = function (node) {
		var points = calcLinkPoints(node);
		
		if (points) {
			points.forEach(function (item) {
				if (!item.ferom  ||  !item.to) { console.warn("adjustLine(): Bad points olaghe sag"); return; }
				var points = [
					item.ferom.x,
					item.ferom.y,
					item.to.x,
					item.to.y
				];
				adjustLine(item.line, points);
			});
		}
		
	},
	addTplLink = function () {
		
	},
	createTplNode = function (conf) {
		if ( !conf ) { var conf = {}; }
		var imgPath = 'images/',
			hasLinks = false,
			links = conf.links,
			tplNode = {},
			sprite,
			text,
			box,
			line,
			id;
		
		if ( links &&
				util.isArr( links ) &&
				links.length > 0 ) {
			hasLinks = true;
		}
		
		//---------------------------------------------------------------
		//	Creating Pixi Elements
		imgPath += conf.type || 'computer';
		imgPath += '.png';
		sprite = pixi.createSprite({
			image: imgPath,
			scale: 0.2,
			alpha: 1,
			x: conf.x || 0,
			y: conf.x || 0
		}, true);
		text = pixi.createText( conf.name || 'no_name', true );
		text.y = sprite.y + sprite.height;
		
		box = new PIXI.Container();
		// box = new PIXI.particles.ParticleContainer();
		box.interactive = true;
		box.buttonMode = true;
		box.scale.set(0);
		box.alpha = 1;
		box.hitArea = new PIXI.Rectangle(0, 0, sprite.width, sprite.height);
		box.position.x = conf.x || 0;
		box.position.y = conf.x || 0;
		box.addChild(sprite);
		box.addChild(text);
		pixi.addDragDrop(box);
		//---------------------------------------------------------------
		
		id = conf.id || 'tpl_node_'+(idCounter+=1);
		tplNode.name = conf.name || 'no_name';
		tplNode.id = id;
		tplNode.node = box;
		if (hasLinks) {
			tplNode.links = {};
			tplNode.linkCount = links.length;
			links.forEach(function (linkIdStr) {
				var target = tplNodes[linkIdStr]; // tplNodes["device_14"]
				// line = pixi.createLine();
				line = pixi.create2pointLine();
				if ( !target.links ) {
					target.links = {};
				}
				target.links[ tplNode.id ] = {};
				target.links[ tplNode.id ].line = line;
				target.linkCount = util.objLength( target.links );
				
				
				tplNode.links[linkIdStr] = {};
				tplNode.links[linkIdStr].line = line;
				/*
				{
					
					
					get x() { return target.node.x; },
					get y() { return target.node.y; },
					get width() { return target.node.width; },
					get height() { return target.node.height; },
					line: pixi.createLine()
					
				}
				*/
				pixi.addChild('lineContainer', line);
			});
		} else {
			tplNode.links = false;
		}
		
		tplNodes[ tplNode.id ] = tplNode;
		box.TPL_Stuff = tplNode;
		
		pixi.addChild('nodeContainer', tplNode.node);
		
		pixi.bringToFront(tplNode.node);
		//adjustLines(tplNode.node);
		animateNode(tplNode.node, {
			done: adjustLines,
			doneParams: [tplNode.node]
		});
		return id;
	},
	init = function () {
		
	};
	
	Object.defineProperties(inst, {
		"some": {
			get: function () { return "some"; }
		}
	});
	inst.adjustLines = adjustLines;
	inst.createTplNode = createTplNode;
	inst.tplNodes = tplNodes;
	inst.init = init;
	
	return inst;
}());


var navigation = (function () {
	var inst = util.extend( coPubsub() ),
		p = {};
	
	function init() {
		var nav,
			panel,
			rect,
			dot;
		
		p.panel = new PIXI.Graphics(),
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
		rect.TPL_nav = 'box';

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
		dot.TPL_nav = 'dot';
		
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
		addDragDrop(panel, 'panel');
		addDragDrop(rect, 'rect');
		addDragDrop(dot, 'dot');
		pixi.addChild('stage', nav);
	}
	function addDragDrop(el, name) {
		if (name === 'rect') {
			el
				.on('mousedown', rectDown)
				.on('touchstart', rectDown)
				.on('mouseup', rectUp)
				.on('mouseupoutside', rectUp)
				.on('touchend', rectUp)
				.on('touchendoutside', rectUp)
				.on('mousemove', rectMove)
				.on('touchmove', rectMove);
		} else if ( name === 'dot' ) {
			el
				.on('mousedown', dotDown)
				.on('touchstart', dotDown)
				.on('mouseup', dotUp)
				.on('mouseupoutside', dotUp)
				.on('touchend', dotUp)
				.on('touchendoutside', dotUp)
				.on('mousemove', dotMove)
				.on('touchmove', dotMove);
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
		this.defaultCursor = 'move';
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
			
			inst.publish('pan');
		}
	}
	function dotMove(e) {
		this.defaultCursor = 'nwse-resize';
		if (this.mouseIsDown) {
			var currentCursor = e.data.getLocalPosition(this.parent),
				resizeX = ( currentCursor.x - this.x ),
				resizeY = ( currentCursor.y - this.y ),
				halfX = resizeX / 2,
				halfY = resizeY / 2,
				panel = p.panel,
				rect = p.rect,
				dot = p.dot;
				
			rect.defaultCursor = 'nwse-resize';
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
			inst.publish('zoom');
		}
	}
	
	inst.init = init;
	return inst;
}());




var mediator = (function () {
	var inst = {},
		p = {};
	
	
	p.GLOBAL_BOUNDS = {
		X_1: -5000,
		X_2: 5000,
		Y_1: -2000,
		Y_2: 2000
	};
	p.data = {};    // unreversed for ajax data
	p.bounds = {};  // adjusted (reversed) to ease bound calculations
	p.width = 0;
	p.height = 0;
	
	function loadData() {
		var cb = a.tpl.draw;
		pixi.clear('lineContainer', true);
		pixi.clear('nodeContainer');
		ajax({
			data: p.data
		})
		.done(cb);
	}
	
	function pixiCallback(width, height) {
		var w = width,
			h = height,
			hW = w / 2,
			hH = h / 2;
		
		p.width = w;
		p.height = h;
		
		p.data.x1 = -hW;
		p.data.x2 = w + hW;
		p.data.y1 = -hH;
		p.data.y2 = h + hH;
		
		p.bounds.x1 = hW;
		p.bounds.x2 = -hW;
		p.bounds.y1 = hH;
		p.bounds.y2 = -hH
		
		console.log(p.bounds);
		console.log(p.data);
		ajax({
			data: p.data
		})
		.done(function ( data ) { // {url: 'js/d.txt'}
			
			console.log(data);
			t = data
			// a.tpl.drawNodes(data.nodes);
			// a.tpl.drawLinks(data.links);
			a.tpl.draw(data);
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
			hH = h / 2;
		
		if (x >= b.x1) { // x1 512   x 0 1 2 3 4 5 6 7 8 9 (going left)
			console.log('salam');
			b.x1 += x;
			b.x2 -= x;
			d.x1 -= hW;
			d.x2 -= hW;
			console.log(b);
			console.log(d);
			loadData();
		}
		
		if (x <= b.x2) { // x2 -512 x -1 -2 -3 -4 -5 -6 -7 (going right)
			console.log('chetori');
			b.x1 -= x;
			b.x2 += x;
			d.x1 += hW;
			d.x2 += hW;
			console.log(b);
			console.log(d);
			loadData();
		}
		
		if (y >= b.y1) { // y1 175   y1 10 20 30 (going up)
			console.log('here');
			b.y1 += hH;
			b.y2 += hH;
			d.y1 -= hH;
			d.y2 += hH;
			console.log(b);
			console.log(d);
			loadData();
		}
		
		if (y <= b.y2) { // y2 -175  y2 -10 -20 -30 (going down)
			console.log('kitty');
			b.y1 -= hH;
			b.y2 -= hH;
			d.y1 += hH;
			d.y2 += hH;		
			console.log(b);
			console.log(d);
			loadData();
		}
		
		// console.log(Math.floor(y));
	}
	/*
	var t = new PIXI.Graphics();
t.beginFill();
t.drawRect(0, 0, 100, 100);
t.endFill;
t.x = 1500
a.pixi.mainContainer.addChild(t);
	*/
	function addCustomEvents() {
		
		pixi.on('pan', panCallback);
		
		navigation.on('zoom', function () {
			console.log('zoom');
			pixi.zoom();
		});
		navigation.on('pan', function () {
			pixi.pan.pan(1, 1);
		});
	}
	function init() {
		pixi.init(pixiCallback, p.GLOBAL_BOUNDS);
		core.init();
		//navigation.init();
		addCustomEvents();
	};
	
	
	inst.data = p.data;
	inst.bounds = p.bounds;
	inst.init = init;
	
	return inst;
}());
	



return {
	pixi: pixi,
	core: core,
	tpl: tpl,
	mediator: mediator
};
	

}());