var log = console.log;

var x = 100;
var y = 100;
var r, g, b;
var texture;

function preload() {
	texture = loadImage("images/1.png");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	
	
	image(texture, 0, 0);
	r = random(255);
	g = random(255);
	b = random(255);
}

function draw() {
	background(127);
	fill(255);
	rect(x, y, 50, 50);
	image(texture, 0, 0);
	strokeWeight(2);
	stroke(r, g, b);
	fill(r, g, b, 127);
	ellipse(360, 200, 200, 200);
}

function mousePressed() {
	log(mouseX, mouseY);
	// Check if mouse is inside the circle
	var d = dist(mouseX, mouseY, 360, 200);
	if (d < 100) {
		// Pick new random color values
		r = random(255);
		g = random(255);
		b = random(255);
	}
}
function mouseDragged() {
	x = mouseX;
	y = mouseY;
}
function mouseReleased() {
	
}


function windowResized() {
	
	resizeCanvas(windowWidth, windowHeight);
	background(127);
}
