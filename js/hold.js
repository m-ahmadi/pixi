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