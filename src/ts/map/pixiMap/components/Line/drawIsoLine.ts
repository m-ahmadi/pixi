const ISO_DEGREE_120 = 1.732; // √3  1.7320508075688772935274463415059
const ISO_DEGREE_30 = 0.577;

4.422 + 0.464

-4.586 / -1.154

3.9740034662045060658578856152513

interface IsoPoints {
	start: Point;
	middle: Point;
	end: Point;
}

function getMiddlePoint() {

}

var start = {
	x: 500,
	y: 100
};
var end = {
	x: 200,
	y: 200
};


//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// calc m1
//----------------------------------------------------------------------------
// calc m1.x
function m1yIntercept1(start: Point): number {
	return start.y - (ISO_DEGREE_120 * start.x);
}
function m1yIntercept2(end: Point): number {
	return end.y - (ISO_DEGREE_30 * end.x);
}
function calcM1x(start: Point, end: Point): number {
	const a = m1yIntercept2(end) - m1yIntercept1(start);
	const b = ISO_DEGREE_120 * a;
	return b / 2;
}
//----------------------------------------------------------------------------
// calc m1.y
function calcM1y(m1X: number, start: Point): number {
	return (ISO_DEGREE_120 * m1X) + m1yIntercept1(start);
}
//----------------------------------------------------------------------------
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// calc m2
function m2yIntercept1(start) {
	return start.y - (ISO_DEGREE_30 * start.x);
}
function m2yIntercept2(start) {
	return end.y - (ISO_DEGREE_120 * end.x);
}
function calcM2x(start: Point, end: Point) {
	const a = m1yIntercept2(end) - m1yIntercept1(start);
	const b = ISO_DEGREE_120 * a;
	return b / -2;
}
//----------------------------------------------------------------------------
// calc m1.y
function calcM2y(m2X: number, start: Point): number {
	return (ISO_DEGREE_30 * m2X) + m2yIntercept1(start);
}
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


function drawIsoLine(start: Point, end: Point): IsoPoints {
	let result: any = {};

	const sX: number = start.x;
	const sY: number = start.y;
	const eX: number = end.x;
	const eY: number = end.y;

	const dx = Math.abs(eX-sX);
	const dy = Math.abs(eY-sY);

	if (dy / dx === ISO_DEGREE) {
		// no operation
		return result;
	}

	const m1x = calcM1x(start, end);
	let m1 = {
		x: m1x,
		y: calcM1y(m1x, start)
	};

	let m2 = {
		x: ,
		y: 
	};

	return result;
}