const CONF = require("./config");
const c = require("colors/safe");
const concat = require("concat");
const fs = require("fs-extra");
const shell = require("shelljs");
const u = require("util-ma");
const log = console.log;
debugger
let w = process.argv[2] || "css";
let js = w === "js";
let css = w === "css";

let iDir, oDir, list, temp, app, sepLib,
	listPath = CONF.L[ w.toUpperCase() ].slice(3);
if (css) {
	iDir = CONF.I.SLIBC;
	oDir = CONF.O.CLIB;
	list = CONF.L.CSS;
	temp = CONF.I.LNKT;
	app = CONF.F.CSS;
	sepLib = CONF.O.SEPLC;
} else if (js) {
	iDir = CONF.I.SLIBJ;
	oDir = CONF.O.JLIB;
	list = CONF.L.JS;
	temp = CONF.I.SCRT;
	app = CONF.F.APP;
	sepLib = CONF.O.SEPLJ;
}

list = require(list);
let last = list[ list.length - 1 ];

let rqName = "require";
let rq = CONF.I.SLIBJ + rqName;
let min = ".min.js";
let unmin = ".js";
let reqSrc, reqDest;
if ( fs.existsSync(rq + min) ) {
	rq += min;
	rqName += min;
	reqDest = CONF.O.SEPLJ + rqName;
} else if ( fs.existsSync(rq + unmin) ) {
	rq += unmin;
	rqName += min;
} else {
	log( c.red.bold("The requirejs library is necessary, and it's not found.") );
}
reqSrc = rq;
reqDest = CONF.O.SEPLJ + rqName;;

log(c.white.bold("\n Current environment:"), c.black.bgWhite(" "+ CONF.env +" \n"));
fs.emptyDirSync( CONF.O[ w.toUpperCase() ] );

if (CONF.env === CONF.DEBUG_HARD) {
	debugHard();
	
} else if (CONF.env === CONF.DEBUG_LIGHT) {
	common(true);
} else if (CONF.env === CONF.RELEASE_LIGHT) {
	common(false);
} else if (CONF.env === CONF.RELEASE_HARD) {
	
}
makeSureRequire();

function debugHard() {
	debugger
	if ( u.isArr(last) ) {
		
		list = list.concat( list.pop() );
	}
	
	let toWrite = "";
	log( c.yellow("Copying...") );
	fs.emptyDirSync(oDir);
	
	toWrite = forEachLib(list, true);
	toWrite += css ? html(`${w}/style.css`) : appHtml("main");
	
	makeSureRequire();
	
	fs.writeFileSync(temp, toWrite, "utf8");
	log( "\nFile:", c.green(temp), "generated." );
	log( c.green("Done.") );
}
function common(srcmap) {
	
	let separates = u.isArr(last) ? list.pop() : undefined;
	
	log( c.yellow("Libs...") );
	let toCat = forEachLib(list, false); 
	
	let libDir = CONF.O[ w.toUpperCase() ] + "lib";
	fs.emptyDirSync(libDir);
	
	let outFile = oDir;
	let catenated = shell.cat(toCat);
	fs.writeFileSync(outFile, catenated, "utf-8");
	log( c.yellow("Minifying...") );
	
	let command;
	if (css) {
		command = `csso ${outFile} -o ${outFile}`;
		command += srcmap ? ` -m ${outFile}.map` : "";
	} else if (js) {
		command = `uglifyjs ${outFile} -o ${outFile}`;
		command += srcmap ? ` --source-map ${outFile}.map` : "";
	}
	
	if (shell.exec(command).code !== 0) {
		shell.echo( c.red.bold("\t Minifying failed.") );
		shell.exit(1);
	}
	log("\t File:", c.cyan(outFile), "created. \n");
	
	let toWrite = "";
	
	toWrite += html(`${w}/lib/${CONF.F.LIB}.${w}`) + "\n";
	toWrite += w === "css" ? '<link rel="styleSheet" type="text/css" href="css/style.min.css" />' : "";
	if (separates) {
		log( c.yellow("Separate lib(s)...") );
		toWrite += forEachLib(separates, true, true);
	}
	
	if (srcmap) {
		log( "\t File:", c.cyan(`${outFile}.map`), "created." );
		toWrite += js ? appHtml("main") : "";
	} else {
		toWrite += js ? appHtml(app) : "";
	}
	
	makeSureRequire();
	
	fs.writeFileSync(temp, toWrite, "utf8");
	log( "\t File:", c.cyan(temp), "created." );
	log( c.green("Done.") );
}
function forEachLib(list, sw, sep) {
	let toRet = sw ? "" : [];
	let occurred = false;
	list.forEach(i => {
		let file = i + "." + w;
		let src  = iDir + file;
		let dest = sep ? sepLib : oDir;
		dest += file;
		if ( fs.existsSync(src) ) {
			sw ? fs.copySync(src, dest) : toRet.push(src);
			sw ? toRet += html(`${w}/lib/`+ file) + "\n" : undefined;
		} else {
			occurred = true;
			let err = c.red.bold("\t Couldn't find: ") + c.white.bold.bgRed(` ${file} `);
			src = iDir + i + ".min." + w;
			if ( fs.existsSync(src) ) {
				err += c.green.bold("  Found: ") + c.magenta(file+".min");
				sw ? fs.copySync(src, dest) : toRet.push(src);
				sw ? toRet += html(`${w}/lib/`+ file) + "\n" : undefined;
			} else {
				err += c.red.bold(" or ") + c.white.bold.bgRed(` ${file} `);
			}
			msg(1, err);
		}
	});
	if (occurred) { msg(2); }
	return toRet;
}
function html(v) {
	if (w === "css") {
		return `<link rel="stylesheet" type="text/css" href="${v}" />`;
	} else if (w === "js") {
		return `<script type="text/javascript" src="${v}"></script>`;
	}
}
function appHtml(v) {
	return `<script data-main="js/${v}" src="js/lib/${rqName}"></script>`;
}
function makeSureRequire() {
	fs.copySync(reqSrc, reqDest);
}
function msg(w, a, b) {
	switch (w) {
	case 1:
		log(a); break;
	case 2:
		log( c.white("\t (Make sure the list in:"), c.blue.bold(listPath), "is correct.)\n" ); break;
	case 3:
		break;
	
		
	}
}