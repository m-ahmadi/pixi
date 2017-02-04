//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// wpix
function create3pointLine(conf) {
	conf = conf ? conf : {};
	var line,
		start, end, ctrl,
		color, width,
		curveLevel, curveSide,
		onmousedown, onmousedownParam,
		onmouseup, onmouseupParam;
	
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
	line.changeColor = changeColor;
	line.changePoints = changePoints;
	
	//p.mainContainer.addChild(line);
	return line;
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// tpl.createLink
if (nth === 1) {
	pixiEl = wpix.create2pointLine({
		start: start,
		end: end,
	//	color: 0xCCAA00 * status,
		color:  status === 0 ? 0x33691e : // green
				status === 1 ? 0x00695c : // cyan
				status === 2 ? 0xffd600 : // yellow
				status === 3 ? 0xe65100 : // orange
				status === 4 ? 0xff1744 : // pink
				status === 5 ? 0xb71c1c : undefined, // red
		alpha: 0
	});
} else if (nth > 1) {
	pixiEl = wpix.create3pointLine({
		start: start,
		end: end,
	//	color: 0xCCAA00 * status,
		curveLevel: curveLevel,
		curveSide: toggle ? false : true
	});
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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
wuk.notify({
	message : '<i class="fa fa-check-circle fa-lg" aria-hidden="true"></i> New socket message received.',
	status  : 'success',
	timeout : 1000,
	pos     : 'bottom-right'
});
wuk.notify({
	message : '<i class="fa fa-exclamation-triangle fa-lg" aria-hidden="true"></i> Socket error.',
	status  : 'danger',
	timeout : 2000,
	pos     : 'bottom-right'
});
wuk.notify({
	message : '<i class="fa fa-info-circle fa-lg" aria-hidden="true"></i> Socket closed.', // fa fa-check
	status  : 'info',
	timeout : 2000,
	pos     : 'bottom-right'
});
noteMsgs.init = wuk.notify({
	message : '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i> Opening socket...',
	status  : 'info',
	timeout : 0,
	pos     : 'top-center'
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var basePath = "images/raw/edited/",
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
PIXI.loader.load();
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
UIkit.offcanvas.hide(false);
$('#sidebar').on('show.uk.offcanvas', function () {
	a.pixi.disableZoom(true);
});
$('#sidebar').on('hide.uk.offcanvas', function () {
	a.pixi.disableZoom(false);
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var traceroute = (function () {
	var ws = {},
		path = 'ws://'+ baseRoot +'/network/icmp/traceroute', // window.location.host
		openCallback,
		coefficient = {},
		nodes = {},
		links = {},
		msgCounter = 0,
		noteMsgs = {},
		scanBtn = {}
	
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
	function createSock(opt) {
		if (opt) { 
			path += '?portscanner=true';
		}
		ws = new WebSocket(path);
		console.log(ws);
	}
	function abort() {
		if ( !u.isEmptyObj(ws) ) {
			ws.close(4999);
		}
	}
	function addHandlers(cb) {
		openCallback = cb;
		
		ws.onopen = onopen;
		ws.onmessage = onmessage;
		ws.onerror = onerror;
		ws.onclose = onclose;
	}
	function onopen(e) {
		var cb = openCallback;
		
		console.log("Connection open...");
			
		// ws.send("Hello WebSocket!");
		
		if ( u.isFn(cb) ) {
			cb();
		}
	}
	function onmessage(e) {
		msgCounter += 1;
			
		if (msgCounter === 1) { // only for the first msg
			noteMsgs.init.close();
			pixi.clearContainer("viewport");
			pixi.mainContainer.x = pixi.renderer.width / 2;
			pixi.mainContainer.y = pixi.renderer.height / 2;
			UIkit.offcanvas.hide(false);
			
			noteMsgs.processing = UIkit.notify({
				message : '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i> در حال دریافت اطلاعات...',
				status  : 'info',
				timeout : 0,
				pos     : 'bottom-right'
			});
		}
		
		
		
		if ( u.isStr(e.data) ) {
			console.log("String message received\n");
			noteMsgs.newData = UIkit.notify({
				message : '<i class="fa fa-check-circle" aria-hidden="true"></i> دریافت اطلاعات جدید.',
				status  : 'success',
				timeout : 1000,
				pos     : 'bottom-right'
			});
			
			
			
			var data = JSON.parse(e.data);
			console.log(data);
			
			data = filter(data);
			
			var nodesLen = Object.keys(data.nodes).length;
			var linksLen = Object.keys(data.links).length;
			
			console.log(nodesLen, linksLen);
			
			coefficient = {
				x: pixi.renderer.width / (300 + 80),
				y: pixi.renderer.height / (300 + 80),
			}
			// console.log(coefficient);
			
			a.tpl.draw(data, "viewport", undefined, coefficient);
			
		} else {
			console.log("Other message received\n", e.data);
		}
	}
	function onerror(e) {
		console.log("WebSocket Error: " , e);
		
		noteMsgs.init.close();
		// noteMsgs.processing.close();
		noteMsgs.error = UIkit.notify({
			message : '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> خطا در برقراری ارتباط!',
			status  : 'danger',
			timeout : 2000,
			pos     : 'bottom-right'
		});
	}
	function onclose(e) {
		console.log("Connection closed", e);
		scanBtn.removeAttr('disabled');
		
		// noteMsgs.processing.close();
		noteMsgs.init.close();
		noteMsgs.close = UIkit.notify({
			message : '<i class="fa fa-info" aria-hidden="true"></i> پایان دریافت.', // fa fa-check
			status  : 'info',
			timeout : 2000,
			pos     : 'bottom-right'
		});
	}
	function trace(arr, opt) {
		noteMsgs.init = UIkit.notify({
			message : '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i> در حال بررسی...',
			status  : 'info',
			timeout : 0,
			pos     : 'top-center'
		});
		scanBtn = $('#scan');
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
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
$('#select_all').on('click', function (e) {
	e.preventDefault();
	var chks = $('input[type="checkbox"]');
	if (chks.length > 0) {
		chks.prop({checked: true});
	}
	
});
$('#add_device').on('click', function (e) {
	var name, id,
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
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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
	
	conf = conf ? conf : {};
	
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
		dirty = false;
	} else if ( !dirty ) {
		dirty = true;
	}
	
	if ( clearDirty ) {
		clearDirty = false;
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
	o = o ? o : {};
	var txt = util.isStr( o ) ? o : o.text;
	
	var text = new PIXI.Text(txt, {
		fontFamily: o.font || "Arial",
		fontSize: o.size || "20px",
		fill: o.color || "black"
	});
	text.interactive = true;
	text.buttonMode = true;
	
	if ( !noDrag ) {
		addDragDrop(text);
	}
	
	return text;
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//var background = new PIXI.Container();
//var tink = new Tink(PIXI, renderer.view);



// var tween = new TWEEN.Tween( graphics.position );
// tween.to( {x: 500}, 1000);
// tween.start();
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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
		//core.init();
		//navigation.init();
		addCustomEvents();
	};
	
	
	inst.data = p.data;
	inst.bounds = p.bounds;
	inst.init = init;
	
	return inst;
}());
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
makeTplNode = function (pixiElement, links, o) {
	/*
		links: [{
			node: pixiElement,
			line: pixiElement
		}, {}, {}]
		
	*/
	var hasLinks = false;
	if ( !o ) { var o = {}; }
	if ( links  &&  util.isArr(links) ) {
		hasLinks = true;
	}
	
	pixiElement.TPL_node = true;
	pixiElement.TPL_nodeID = o.nodeId || 'no_id';
	pixiElement.TP_nodeName = o.nodeName || 'no_name';
	
	if (hasLinks) {
		pixiElement.TPL_links = [];
		pixiElement.TPL_linkCount = links.length;
		links.forEach(function (item) {
			pixiElement.TPL_links.push({
				get x() { return item.node.x; },
				get y() { return item.node.y; },
				get width() { return item.node.width; },
				get height() { return item.node.height; },
				get linkCount() { return item.node.TPL_linkCount; },
				get line() { return item.line; }
			});
		});
	} else {
		pixiElement.TPL_links = false;
	}
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var rectPos = getFullPositions(rect),
	panelPos = getFullPositions(panel),
	min = 0,
	maxX = panel.x + panel.width;

if ( rectPos.right <= panelPos.right ) {
	if ( rect.x > min ) {
		rect.width += resizeX;
		rect.position.x -= halfX;
	} else if ( rect.x <= min ) { // left reached
		rect.width += resizeX;
	} else if ( rectPos.right >= maxX ) {
		//rect.width -= resizeX;
	}
}


if ( rectPos.bott <= panelPos.bott ) {
	if ( rect.y > min ) {
		rect.height += resizeX;
		rect.position.y -= halfX;
		
	} else if ( rect.y <= min ) {
		rect.height += resizeX;
	}
}
/*
rect.width += resizeX;
rect.position.x -= halfX;

rect.height += resizeX; // resizeY
rect.position.y -= halfX; // halfY

dot.position.x += halfX;
dot.position.y += halfX; // halfY
rect.defaultCursor = 'nwse-resize';
*/
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
/*
sourceSide = '',
targetSide = '',
if (farUp || midUp) {
	sourceSide = 'top';
	targetSide =  'bottom';
} else if (farDown || midDown) {
	sourceSide = 'bottom';
	targetSide =  'top';
} else if (farRight || midRight) {
	sourceSide = 'right';
	targetSide = 'left';
} else if (farLeft || midLeft) {
	sourceSide = 'left';
	targetSide =  'right';
}
source.side = sourceSide;
target.side = targetSide;

*/
//calcSidePoints( source, target );
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var middleY;
function adjustLine(line, fromPoint, toPoint) {
	var x1 = fromPoint.x,
		y1 = fromPoint.y,
		x2 = toPoint.x,
		y2 = toPoint.y,
		distanceX, distanceY,
		midX, midY,
		bigX, smallX,
		bigY, smallY,
		diffY,
		toLeftX = false,
		toRightX = false,	
		toUpY = false,
		toDownY = false,
		rotateCalc,
		rotation;
	if (x1 < 0 ||
		y1 < 0 ||
		x2 < 0 ||
		y2 < 0) {
		throw new Error('adjustLine():  Something\'s not right');
	}
		
	if (x1 > x2) {	
		bigX = x1;
		smallX = x2;
		toLeftX = true;
	} else if (x2 > x1) {
		bigX = x2;
		smallX = x1;
		toRightX = true;
	}
	if (y1 > y2) {
		bigY = y1;
		smallY = y2;
		toUpY = true;
	} else if (y2 > y1) {
		bigY = y2;
		smallY = y1;
		toDownY = true;
	}
	distanceX = bigX - smallX;
	distanceY = bigY - smallY; // get diff in positive
	diffY = y1 - y2;           // get diff positive and negative
	
	midX = smallX + (distanceX / 2);
	midY = smallY + (distanceY/ 2);
	middleY = midY;
	
	/* how to rotate it?
		
	//rotation = ( ( (midY - smallY) / 2) + smallY ) / 1000;
	//rotation = a.util.makeNumberNegative( rotation )
	rotation = distanceY / 1000;
	*/
	
	if (toRightX) {
		rotateCalc = (y1 - y2) / 800;
		rotation = a.util.makeNumberNegative( rotateCalc );
	} else if (toLeftX) {
		rotation = (y1 - y2) / 800;
	}
	if (toUpY) {
		
	} else if (toDownY) {
		
	}
	
	//console.log( rotation );
	
	line.x = midX;
	line.y = midY;
	line.width = distanceX;
	line.rotation = rotation;
	
	
	/*
		which point is on left
		which one is right
		which point is upper
		which point is lower
		
		adjust line width in high rotations
	*/
	
	/*
		get two points that needs to be connected
		calc the x between them
		rotate but save 2 points of the line
		rotate and change width if 2 points of line changes
	*/
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var line = PIXI.Sprite.fromImage('images/line.png');
line.interactive = true;
line.buttonMode = true;

line.width = 200;
line.height = 10;
line.x = Math.random() * window.innerWidth *5;
line.y = Math.random() * window.innerHeight *5;
line.anchor.set(0);

addDragDrop(line);
stage.addChild(line);

//----------------------------------
var line = new PIXI.Graphics();
line.lineStyle(1, 0x101010, 1);
line.beginFill();
line.moveTo(Math.random() * window.innerHeight *10, Math.random() * window.innerHeight *10);
line.lineTo(Math.random() * window.innerHeight *10, Math.random() * window.innerHeight *10);
line.endFill();

var newline = line.clone();
newline.x = Math.random() * window.innerWidth *5;
newline.y = Math.random() * window.innerHeight *5;

addDragDrop(line);
stage.addChild(line);
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var i;
for (i = 0; i < 30000; i+=1) {
	var ll = new PIXI.Graphics();
	ll.interactive = true;
	ll.buttonMode = true;
	ll.lineStyle(2, 0x101010, 1);
	ll.beginFill();

	ll.moveTo(
		Math.random() * window.innerWidth *10,
		Math.random() * window.innerHeight *10
	);
	ll.lineTo(
		Math.random() * window.innerWidth *50,
		Math.random() * window.innerHeight *50
	);


	// // ll.drawRoundedRect(
		// // Math.random() * window.innerWidth *5,
		// // Math.random() * window.innerHeight *5,
		// // 200, 300, 100, 15);
	
	
	ll.endFill();
	addDragDrop(ll);
	stage.addChild(ll);
	
	-------------------------------------------------------------------
	var g = new PIXI.Graphics();
	g.interactive = true;
	g.buttonMode = true;
	g.beginFill(0x28ab99);
	g.lineStyle(0, 0xFF0000, 1);
	g.drawRect(
		Math.random() * window.innerWidth *10,
		Math.random() * window.innerWidth *10,
		60, 60);
	g.endFill();
	addDragDrop(g);
	stage.addChild(g);
	
	-------------------------------------------------------------------
	var s = new PIXI.Sprite.fromImage('images/computer.png');
	s.interactive = true;
	s.buttonMode = true;
	s.anchor.set(0.5);
	s.scale.set(0.09);
	s.position.x = Math.random() * window.innerWidth *10;
	s.position.y = Math.random() * window.innerWidth *10;
	addDragDrop(s);
	stage.addChild(s);
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var firstPoint = {
	x: 100,
	y: 150
},
secondPoint = {
	x: 500,
	y: 100
};
function adjustLine(line, fistPoint, secondPoint) {
	var x1 = firstPoint.x,
		y1 = firstPoint.y,
		x2 = secondPoint.x,
		y2 = secondPoint.y,
		distanceX, distanceY,
		midX, midY,
		bigX, smallX,
		bigY, smallY,
		rotation;
	
	if (x1 > x2) {	
		bigX = x1;
		smallX = x2;
	} else if (x2 > x1) {
		bigX = x2;
		smallX = x1;
	}
	if (y1 > y2) {
		bigY = y1;
		smallY = y2;
	} else if (y2 > y1) {
		bigY = y2;
		smallY = y1;
	}
	
	distanceX = bigX - smallX;
	distanceY = bigY - smallY;
	
	midX = smallX + (distanceX / 2);
	midY = smallY + (distanceY / 2);
	rotation = ( ( (midY - smallY) / 2) + smallY ) / 1000;
	console.log(midY, rotation);
	line.x = midX;
	line.y = midY;
	line.width = distanceX / 2;
	line.rotation = a.util.makeNumberNegative( rotation );
	//line.rotation = rotation;
	// adjust line width in high rotations
}
//adjustLine(line, firstPoint, secondPoint);
//line.x += newX - prevX;
//line.y += newY - prevY;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var prevX,
	prevY,
	howmuchUp = 0,
	howmuchDown = 0;

//line2.rotation -= 0.01;
var up = newY < prev,
	down = newY > prev;
if (up) {
	howmuchUp += prev - newY;
	
	line.rotation += howmuchUp / 5000;
	var calc = howmuchUp / 10;
	if ( a.util.isInt(calc) ) {
		console.log( howmuchUp);
		line.x += 10;
	}
	//console.log(howmuchUp);
} else if (down) {
	howmuchDown += newY - prev;
	
	line.rotation -= howmuchDown / 5000;
	var calc = howmuchUp / 10;
	if ( a.util.isInt(calc) ) { // every ten times
		line.x -= 1;
	}
	//console.log(howmuchDown);
}
//line2.x = newX + 120;
line.y = newY + 35;
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@