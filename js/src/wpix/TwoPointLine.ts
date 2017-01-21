import * as sh from '../shared';
import u from '../util';


export default class TwoPointLine {
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
		this.alpha   =  u.isNum(this.alpha) ? this.alpha : 1;
		this.p       =  this.calcPoints();

		this.create();
		// line.alpha = alpha;
		this.line.setOnmousedown = function (param, fn) {
			this.onmousedownParam = param;
			this.onmousedown = fn;
		};
		this.line.changePoints = this.changePoints;
		this.line.changeColor = this.changeColor;
		Object.defineProperty(this.line, "points", {
			get: function () { return {start: this.start, end: this.end}; }
		});
		
		return this.line;
	}
	
	
	private setStart(s) {
		if (s) {
			this.start = s;
		}
	}
	private setEnd(e) {
		if (e) {
			this.end = e;
		}
	}
	private setWidth(w) {
		if (w) {
			this.width = w;
		}
	}
	private setColor(c) {
		if (c) {
			this.color = c;
		}
	}
	private down(e) {
		e.stopPropagation();
		this.alpha = 0.5;
		
		if ( u.isFn(onmousedown) ) {
			onmousedown.apply(undefined, this.onmousedownParam);
		}
	}
	private up() {
		this.alpha = 1;
	}
	private over() {
		this.tmpWidth = this.width;
		this.width *= 4;
		this.p = this.calcPoints();
		this.line.clear();
		this.draw();
		this.toggleDirties();
	}
	private out() {
		this.width = this.tmpWidth;
		this.p = this.calcPoints();
		this.line.clear();
		this.draw();
		this.toggleDirties();
	}
	private addEvents() {
		this.line
			.on("mousedown", this.down) 
			.on("touchstart", this.down)
			.on("mouseup", this.up)
			.on("mouseupoutside", this.up)
			.on("touchend", this.up)
			.on("touchendoutside", this.up)
		//	.on("mousemove", move)
		//	.on("touchmove", move)
			.on("mouseover", this.over)
			.on("mouseout", this.out);
	}
	private toggleDirties() {
		var dirty = this.line.dirty,
			clearDirty = this.line.clearDirty;
		
		dirty = dirty ? false : true;
		clearDirty = clearDirty ? false : true;
	}
	private calcPoints() {
		var half = this.width / 2,
			sLeft = {},
			sRight = {},
			eRight = {},
			eLeft = {},
			sX = this.start.x,
			sY = this.start.y,
			eX = this.end.x,
			eY = this.end.y,
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
		this.setColor(c);
		this.line.clear();
		this.draw();
		this.toggleDirties();
	}
	private changePoints(s, e) {
		this.setStart(s);
		this.setEnd(e);
		this.p = this.calcPoints();
		this.line.clear();
		this.draw();
		this.toggleDirties();
	}
	private draw() {
		let line = this.line,
			color = this.color,
			p = this.p;
		
		line.beginFill( color );
		line.moveTo( p.sLeft.x, p.sLeft.y );
		line.lineTo( p.sRight.x, p.sRight.y );
		line.lineTo( p.eRight.x, p.eRight.y );
		line.lineTo( p.eLeft.x, p.eLeft.y );
		line.endFill();
	}
	private createElement() {
		let line;
		
		line = new PIXI.Graphics();
		line.interactive = true;
		line.buttonMode = true;
		line.lineStyle(0);
		
		return line;
	}
	private create() {
		this.line = this.createElement();
		this.addEvents();
		this.draw();
	}
}