export default function calcProps(start: Point, end: Point): SpriteLineProps {
	let r: any = {}; // result
	let sX: number = start.x;
	let	sY: number = start.y;
	let	eX: number = end.x;
	let	eY: number = end.y;

	let	pow = Math.pow;
	let	sqrt = Math.sqrt;
	let	atan = Math.atan;
	let	abs = Math.abs;
	let	PI = Math.PI;

	let dx: number = abs(eX-sX);
	let dy: number = abs(eY-sY);

	r.height = 1;
	if (sY === eY) { // horizontal
		if (sX < eX) {
			r.x = sX;
			r.y = sY;
			r.width = eX-sX;
		} else if (eX < sX) {
			r.x = eX;
			r.y = eY;
			r.width = sX-eX;
		}
	} else if (sX === eX) { // vertical
		if (sY < eY) {
			r.x = sX;
			r.y = sY;
			r.height = eY-sY;
		} else if (eY < sY) {
			r.x = eX;
			r.y = eY;
			r.height = sY-eY;
		}
	} else {
		r.x = sX;
		r.y = sY;
		if (sX < eX && eY > sY) { // to bott right
			r.width = sqrt( pow(dy, 2) + pow(dx, 2) );
			r.rotation = atan(dy / dx);
		} else if (sX < eX && eY < sY) { // to top right
			r.width = sqrt( pow(dy, 2) + pow(dx, 2) );
			r.rotation = -atan(dy / dx);;
		} else if (sX > eX && eY > sY) { // to bott left
			r.width = sqrt( pow(dy, 2) + pow(dx, 2) );
			r.rotation = PI-atan(dy / dx);;
		} else if (sX > eX && eY < sY) { // to top left
			r.width = sqrt( pow(dy, 2) + pow(dx, 2) );
			r.rotation = PI+atan(dy / dx);;
		}
	}

	return r;
}