PIXI.utils.skipHello();
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {backgroundColor: 0xab9988, antialias: true});
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();

var x = new PIXI.Graphics();
// x.beginFill(0xff0000, 1);
x.lineStyle(1, 0xff0000, 1);
x.moveTo(0, 0);
x.lineTo(100, 100);
x.lineTo(600, 200);
stage.addChild(x);


function animate() {
	requestAnimationFrame(animate);

	for (let i = 0; i < 200; i += 1) {
		
	}

	renderer.render(stage);
}
$(function () {
	animate();
});



function calcProps(start, end) {
	let r = {}; // result
	let sX = start.x;
	let sY = start.y;
	let eX = end.x;
	let eY = end.y;

	let pow = Math.pow;
	let sqrt = Math.sqrt;
	let atan = Math.atan;
	let abs = Math.abs;
	let PI = Math.PI;

	let dx = abs(eX - sX);
	let dy = abs(eY - sY);

	r.height = 1;
	if (sY === eY) {
		// horizontal
		if (sX < eX) {
			r.x = sX;
			r.y = sY;
			r.width = eX - sX;
		} else if (eX < sX) {
			r.x = eX;
			r.y = eY;
			r.width = sX - eX;
		}
	} else if (sX === eX) {
		// vertical
		if (sY < eY) {
			r.x = sX;
			r.y = sY;
			r.height = eY - sY;
		} else if (eY < sY) {
			r.x = eX;
			r.y = eY;
			r.height = sY - eY;
		}
	} else {
		r.x = sX;
		r.y = sY;
		if (sX < eX && eY > sY) {
			// to bott right
			r.width = sqrt(pow(dy, 2) + pow(dx, 2));
			r.rotation = atan(dy / dx);
		} else if (sX < eX && eY < sY) {
			// to top right
			r.width = sqrt(pow(dy, 2) + pow(dx, 2));
			r.rotation = -atan(dy / dx);
		} else if (sX > eX && eY > sY) {
			// to bott left
			r.width = sqrt(pow(dy, 2) + pow(dx, 2));
			r.rotation = PI - atan(dy / dx);
		} else if (sX > eX && eY < sY) {
			// to top left
			r.width = sqrt(pow(dy, 2) + pow(dx, 2));
			r.rotation = PI + atan(dy / dx);
		}
	}

	return r;
}
function setProps(el, props) {
	el.x = props.x;
	el.y = props.y;
	el.width = props.width;
	el.height = props.height;
}
function Line(texture) {
	this.start = conf.start || defaultPoint;
	this.end = conf.end || defaultPoint;
	this.thickness = conf.thickness || 2;
	this.color = conf.color || 0x000000;
	this.alpha = conf.alpha || 1;
	this.el = createElement();
	let props = calcProps(this.start, this.end);
	setProps(this.el, props);
}