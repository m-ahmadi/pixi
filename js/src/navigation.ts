import wpix from './wpix';
import newPubSub from './pubsub';
import util from './util';

var navigation = (function () {
	var inst = util.extend( newPubSub() ),
		p: any = {};
	
	function init() {
		var nav,
			panel,
			rect,
			dot;
		
		p.panel = new wpix.Graphics();
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
		
		p.rect = new wpix.Graphics();
		p.rectWidth = wpix.renderer.width / 10;
		p.rectHeight = wpix.renderer.height / 3;
		rect = p.rect;
		rect.interactive = true;
		rect.buttonMode = true;
		rect.beginFill(0x2196F3, 1);
		rect.lineStyle(0);
		rect.drawRect(0, 0, 150, 150);
		rect.endFill();
		rect.alpha = 0.5;
		rect.TPL_nav = "box";

		p.dot = new wpix.Graphics();
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
		
		p.nav = new wpix.Container();
		p.navPos = new wpix.Point(
			wpix.renderer.width - (p.panelWidth + p.panelOffset),
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
		wpix.addChild("stage", nav);
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
				rectNewPos = new wpix.Point(),
				dotNewPos = new wpix.Point();
			
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

export default navigation