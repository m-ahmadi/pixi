const DIR = "template/static";
const EXT = ".handlebars";

let Handlebars = require("handlebars");
let chokidar = require("chokidar");
let watcher = chokidar.watch(`${DIR}/**/*${EXT}`, {ignored: /[\/\\]\./, persistent: true});
let colors = require("colors/safe");
let fs = require("fs");
let fileOpt = {encoding: "utf-8", flag: "r"};
let once = process.argv.indexOf("--once") !== -1;
let log = console.log;

if (!once) {
	watcher
		.on("ready", function () {
			log( colors.blue.bold("Initial scan complete. Ready for changes.") );
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
function dirs(p) {
	return fs.readdirSync(p).filter( f => fs.statSync(p+"/"+f).isDirectory() );
}
function files(p) {
	return fs.readdirSync(p).filter( f => fs.statSync(p+"/"+f).isFile() );
}

let src = {
	template: undefined,
	data: {}
};
/*
	{
		template: fn(data),
		data: {
			profile: "",
			modals: "",
			box: "",
		},
	
	}
*/

function addTemplate(path, namespace) {
	if (namespace) {
		src[namespace].template = Handlebars.compile( readFile(path) );
	} else {
		src.template = Handlebars.compile( readFile(path) );
	}
}
function addData(path, namespace, fileName) {
	if (namespace) {
		src[namespace].data[fileName] = readFile(path);
	} else {
		src.data[fileName] = readFile(path);
	}
}

function fudge(path, namespace) {
	let root = path+"/";
	
	files(path).forEach(i => {
		let fullPath = root+i;
		if ( i.endsWith(".handlebars") ) {
			addTemplate(fullPath, namespace);
		} else if ( i.endsWith(".htm") ) {
			let fileName = i.substr( 0, i.indexOf('.') );
			addData(fullPath, namespace, fileName);
		}
	});
	["a.htm", "b.htm", "c.asad"]
	dirs(path).forEach(i => {
		let fullPath = root+i;
		console.log( fullPath );
		let files = files(fullPath);
		
		if (files.indexOf("main.handlebars") !== -1) { // folder contains .handlebars
		
		} else { // folder doesn't contain .handlebars
			if (files.length) {
				files.forEach(i => {
					if ( i.endsWith("htm") ) {
						addData( fullPath, i, i.substr( 0, i.indexOf('.') ) );
					}
				});
			} else {
				fudge(fullPath, i);
			}
		}
	});
	
	console.log(src);
}
function createIndex() {
	fudge("template/static/modals");
	
	
}


createIndex();

/*

function createIndex() {
	let index = readFile(DIR+"/index.handlebars");
	
	let output = "";
	
	console.log( files(DIR) );
	walk("template/static/profile").forEach(i => {
		let p = i.replace(DIR, "").slice(1);
		let a = p.split("/");
		
		if (p.indexOf("/") === -1) { // root folder
			src.data = {};
			if ( p.endsWith(".handlebars") ) { // template
				
				
				src.template = Handlebars.compile( readFile(i) )();
				
			} else if ( p.endsWith(".htm") ) { // data
				let fileName = p.substr( 0, p.indexOf('.') );
				src.data[fileName] = readFile(i);
				
				
			}
		} else if (p.indexOf("/") >=0) { // 
			
		}
	});
	// console.log( walk(DIR) );
	
	
	
	
	
	
}


if (files.filter(v => {return /.htm/.test(v)}).length) { // at-least one .htm file

*/