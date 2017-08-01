export default function calcProps(start: Point, end: Point): SpriteLineProps {
	const r: any = {}; // result
	const sX: number = start.x;
	const sY: number = start.y;
	const eX: number = end.x;
	const eY: number = end.y;

	const pow = Math.pow;
	const sqrt = Math.sqrt;
	const atan = Math.atan;
	const abs = Math.abs;
	const PI = Math.PI;
	
	const dx: number = abs(eX-sX);
	const dy: number = abs(eY-sY);

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