const DIR = "template/static";
const EXT = ".handlebars";

let Handlebars = require("handlebars");
let chokidar = require("chokidar");
let watcher = chokidar.watch(`${DIR}/**/*${EXT}`, {ignored: /[\/\\]\./, persistent: true});
let colors = require("colors/safe");
let fs = require("fs");
let fileOpt = {encoding: "utf-8", flag: "r"};
let once = process.argv[2] === "--once";
let log = console.log;

if (!once) {
	watcher
		.on("ready", function () {
			log(colors.blue.bold("Initial scan complete. Ready for changes."));
		})
		.on("add", path => {
			log( colors.green.bold("File added:"), path );
		})
		.on("addDir", path => {
			log( colors.black.bgGreen("Folder added: "), path );
		})
		.on("unlink", path => {
			log( colors.red.bold("File removed: "), path );
		})
		.on("unlinkDir", path => {
			log( colors.white.bgRed("Folder removed:"), path );
		})
		.on("change", path => {
			log( colors.cyan.bold("File changed: "), path );
		});
}


function walk(dir) {
	let results = []
	let list = fs.readdirSync(dir);
	list.forEach( function (file) {
		file = dir + '/' + file;
		let stat = fs.statSync(file);
		if ( stat && stat.isDirectory() ) {
			results = results.concat( walk(file) );
		} else {
			results.push(file)
		}
	});
	return results;
};

function readFile(path) {
	return fs.readFileSync(path, { encoding: 'utf-8', flag: 'r' });
}
function getDirsIn(p) {
	return fs.readdirSync(p).filter( f => fs.statSync(p+"/"+f).isDirectory() );
}
function getFilesIn(p) {
	return p => fs.readdirSync(p).filter( f => !fs.statSync(p+"/"+f).isDirectory() );
}

function createIndex() {
	let index = readFile(DIR+"/index.handlebars");
	
	walk(DIR).forEach(i => {
		let p = i.replace(DIR, "").slice(1);
		let a = p.split("/");
		let last = a[a.length-1];
		// console.log(a);
		if (last.endsWith(".handlebars")) {
			// console.log(last.replace(DIR, ""));
		}
	});
	console.log( walk(DIR) );
	
	
	
	
	
	
	/* let source = readFile(DIR+"/main"+EXT);
	let a = Handlebars.compile(source);
	
	console.log(a);
	fs.writeFile("shindex.html", "Hey there!", "utf8", (err) => {
		if (err) { return console.log(err); }
		log("The file was saved!");
	}); */
}

createIndex();


/*
let g = Handlebars.compile(src.main)();
	console.log(g);
	// getDirsIn(DIR).forEach(i => {
	
*/