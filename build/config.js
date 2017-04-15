const fs = require("fs");
let env  = fs.readFileSync("build/env", "utf8");

const DEBUG_HARD    = "debug-hard";
const DEBUG_NORMAL  = "debug-normal";
const DEBUG_LIGHT   = "debug-light";
const RELEASE_LIGHT = "release-light";
const RELEASE_HARD  = "release-hard";
const RJS           = "node node_modules/requirejs/bin/r.js";
const RCONF         = "./rconfig.js"

const SRC  = "src/";
const DIST = "dist/";
const ST   = "main.handlebars";
const SD   = ".htm";
let hInd   = "    ";
const F = {
	HTML:    "index.html",
	TEMP:    "templates.js",
	CLL:     "libcss.js",
	JLL:     "libjs.js",
	SASS:    "style.scss",
	CSS:     "style",
	APP:     "app",
	LIB:     "libs",
	LINKS:   "links.htm",
	SCRIPTS: "scripts.htm"
};
if (env === DEBUG_HARD || env === DEBUG_NORMAL) {
	F.CSS  += ".css";
	F.APP  += ".js";
} else {
	F.CSS  += ".min.css";
	F.APP  += ".min.js";
	F.LIB  += ".min";
}
const I = {};
const O = {};

I.JS    = SRC    +  "js/";
I.SASS  = SRC    +  "sass/";
I.HTML  = SRC    +  "html/";
I.TEMP  = SRC    +  "template/";
I.LIB   = SRC    +  "lib/";
I.SLIBC = I.LIB  +  "css/";
I.SLIBJ = I.LIB  +  "js/";
I.STYLE = I.SASS +  F.SASS;
I.LNKT  = I.HTML +  F.LINKS;
I.SCRT  = I.HTML +  F.SCRIPTS;

O.JS    = DIST   + "js/";
O.CSS   = DIST   + "css/";
O.CLIB  = O.CSS  + "lib/";
O.JLIB  = O.JS   + "lib/";
O.HTML  = DIST   + F.HTML;
O.STYLE = O.CSS  + F.CSS;
O.APP   = O.JS   + F.APP;
O.TEMP  = I.JS   + F.TEMP;

O.SEPLC = O.CLIB;
O.SEPLJ = O.JLIB;
O.CLIB += env !== DEBUG_HARD ? F.LIB+".css" : "";
O.JLIB += env !== DEBUG_HARD ? F.LIB+".js"  : "";

const R    = "../";
const L = {
	CSS: R + I.LIB + F.CLL,
	JS:  R + I.LIB + F.JLL
};

const C = {};
C.html  = `htmlbilder ${I.HTML} -o ${O.HTML} -t ${ST} -e ${SD}`;
C.sass  = `sass ${I.STYLE}:${O.STYLE}`;
C.temp  = `handlebars ${I.TEMP} -f ${O.TEMP} -e hbs -m`;
C.js    = `babel ${I.JS} -d ${O.JS} -s`;

if (env === DEBUG_HARD) {
	C.sass += " --style expanded --sourcemap=auto";
} else if (env === DEBUG_NORMAL) {
	C.sass += " --style expanded --sourcemap=auto";
	
} else if (env === DEBUG_LIGHT) {
	C.sass += " --style compressed --sourcemap=auto";
	C.js   += " --minified";
} else if (env === RELEASE_LIGHT) {
	C.sass += " --style compressed --sourcemap=none";
	
	let rconf = JSON.parse( fs.readFileSync(RCONF, "utf8") );
	rconf.baseUrl = I.JS;
	rconf.out = O.APP;
	rconf.optimize = "none";
	fs.writeFileSync(RCONF, JSON.stringify(rconf, null, 4), "utf8");
	
	C.js = `${RJS} -o ${RCONF} && babel ${I.JS} -o ${O.APP} -s --minified --no-comments`;
} else if (env === RELEASE_HARD) {
	
}
C.w = {};
C.w.html = C.html + " -w";
C.w.sass = C.sass + " --watch";
C.w.jsW  = C.js   + " -w";

module.exports = {
	DEBUG_HARD: DEBUG_HARD,
	DEBUG_NORMAL: DEBUG_NORMAL,
	DEBUG_LIGHT: DEBUG_LIGHT,
	RELEASE_LIGHT: RELEASE_LIGHT,
	RELEASE_HARD: RELEASE_HARD,
	env: env,
	I: I,
	O: O,
	L: L,
	F: F,
	C: C
};