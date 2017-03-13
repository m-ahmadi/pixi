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
		src.data[namespace].template = Handlebars.compile( readFile(path) );
	} else {
		src.template = Handlebars.compile( readFile(path) );
	}
}
function addData(path, namespace, fileName, noTemp) {
	if (namespace) {
		if (!noTemp) {
			if (!src.data[namespace]) {
				src.data[namespace] = {
					template: undefined,
					data: {}
				};
			}
			src.data[namespace].data[fileName] = readFile(path);
		} else {
			if (!src.data[namespace]) {
				src.data[namespace] = "";
			}
			src.data[namespace].concat( readFile(path) );
		}
	} else {
		src.data[fileName] = readFile(path);
	}
}

function fudge(path, namespace) {
	let root = path.endsWith("/") ? path: path+"/";
	
	files(path).forEach(i => {
		let fullPath = root+i;
		if ( i.endsWith(".handlebars") ) {
			addTemplate(fullPath, namespace);
		} else if ( i.endsWith(".htm") ) {
			let fileName = i.substr( 0, i.indexOf('.') );
			addData(fullPath, namespace, fileName);
		}
	});
	let ass = dirs(path);
	dirs(path).forEach(i => {
		let fullPath = root+i;
		console.log( fullPath );
		let filesList = files(fullPath);
		
		if (filesList.indexOf("main.handlebars") !== -1) { // folder contains .handlebars
			fudge(fullPath, i);
		} else { // folder doesn't contain .handlebars
			if (filesList.length) {
				filesList.forEach(j => {
					if ( j.endsWith("htm") ) {
						addData( fullPath+"/"+j, i, j.substr( 0, j.indexOf('.') ), true );
					}
				});
			} else {
				
			}
		}
	});
	debugger
	console.log(src);
}
function createIndex() {
	fudge("template/static");
	
	
}

debugger
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

















walk(DIR).forEach(i => {
		let p = i.replace(DIR, "").slice(1);
		let a = p.split("/");
		let last = a[a.length-1];
		console.log(a);
		if (last.endsWith(".handlebars")) {
			// console.log(last.replace(DIR, ""));
		}
	});
	// console.log( walk(DIR) );






	let source = readFile(DIR+"/main"+EXT);
	let a = Handlebars.compile(source);
	
	console.log(a);
	fs.writeFile("shindex.html", "Hey there!", "utf8", (err) => {
		if (err) { return console.log(err); }
		log("The file was saved!");
	});



let g = Handlebars.compile(src.main)();
	console.log(g);
	// getDirsIn(DIR).forEach(i => {
	
*/