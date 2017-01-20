import * as sh from '../shared';
import u from '../util';


class TwoPointLine {
	private line: any;
	private start: sh.Point;
	private end: sh.Point;
	private width: number;
	private tmpWidth: number;
	private alpha: number;
	private color: number;
	private p: any;
	private onmousedown: () => void;
	private onmousedownParam: () => void;


	constructor(conf?: any) {
		conf = conf ? conf : {};

		this.start   =  conf.start     ||  {x: 0, y: 0};
		this.end     =  conf.end       ||  {x: 0, y: 0};
		this.width   =  conf.width     ||  2;
		this.color   =  conf.color     ||  0x000000;
		this.alpha   =  conf.alpha;
		this.alpha   =  u.isNum(alpha) ? alpha : 1;
		this.p       =  this.calcPoints();

	}
	
	
	private setStart(s) {
		if (s) {
			start = s;
		}
	}
	private setEnd(e) {
		if (e) {
			end = e;
		}
	}
	private setLineWidth(w) {
		if (w) {
			lineWidth = w;
		}
	}
	private setColor(c) {
		if (c) {
			color = c;
		}
	}
	private down(e) {
		e.stopPropagation();
		this.alpha = 0.5;
		
		if ( u.isFn(onmousedown) ) {
			onmousedown.apply(undefined, onmousedownParam);
		}
	}
	private up() {
		this.alpha = 1;
	}
	private over() {
		tmpLineWidth = lineWidth;
		lineWidth *= 4;
		p = calcPoints();
		line.clear();
		draw();
		toggleDirties();
	}
	private out() {
		lineWidth = tmpLineWidth;
		p = calcPoints();
		line.clear();
		draw();
		toggleDirties();
	}
	private addEvents() {
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
	private toggleDirties() {
		var dirty = line.dirty,
			clearDirty = line.clearDirty;
		
		dirty = dirty ? false : true;
		clearDirty = clearDirty ? false : true;
	}
	private calcPoints() {
		var half = lineWidth / 2,
			sLeft = {},
			sRight = {},
			eRight = {},
			eLeft = {},
			sX = start.x,
			sY = start.y,
			eX = end.x,
			eY = end.y,
			results: any = {};

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
	private changeColor(c) {
		setColor(c);
		line.clear();
		draw();
		toggleDirties();
	}
	private changePoints(s, e) {
		setStart(s);
		setEnd(e);
		p = calcPoints();
		line.clear();
		draw();
		toggleDirties();
	}
	private draw() {
		line.beginFill( color );
		line.moveTo( p.sLeft.x, p.sLeft.y );
		line.lineTo( p.sRight.x, p.sRight.y );
		line.lineTo( p.eRight.x, p.eRight.y );
		line.lineTo( p.eLeft.x, p.eLeft.y );
		line.endFill();
	}
	private createElement() {
		var line;
		
		line = new PIXI.Graphics();
		line.interactive = true;
		line.buttonMode = true;
		line.lineStyle(0);
		
		return line;
	}
	private create() {
		line = createElement();
		addEvents();
		draw();
	}
	
	setThings();
	create();
	line.alpha = alpha;
	
	line.setOnmousedown = function (param, fn) {
		onmousedownParam = param;
		onmousedown = fn;
	};
	line.changePoints = changePoints;
	line.changeColor = changeColor;
	Object.defineProperty(line, "points", {
		get: function () { return {start: start, end: end}; }
	});
	
	return line;
}