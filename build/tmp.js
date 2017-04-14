const DEFAULT_PAGE = "app";
const pageFile = "build/page";
let page = fs.existsSync(pageFile) ? fs.readFileSync(pageFile, "utf8") + "/" : "";
const DIST = page ? "dist-"+page : "dist/";
const I = {
	JS:   SRC  + "js/"   + page,
	SASS: SRC  + "sass/" + page,
	HTML: SRC  + "html/" + page,
	TEMP: SRC  + "temp/" + page,
	LIB:  SRC  + "lib/"  + page,
	get LIB_CSS() { return this.LIB + "css/" },
	get LIB_JS()  { return this.LIB + "js/" }
};

// setPage
const fs = require("fs");
const c = require("colors/safe");
const v = process.argv[2] || "app";
fs.writeFileSync("build/page", v);
console.log(
	c.yellow.bold("Switched to"),
	c.white.bold.bgCyan(" Multi-Page "),
	c.yellow.bold("mode. \n\n"),
	c.magenta.bold("Current page is set to:"),
	c.blue.bold(v)
);

// unsetPage
const file = "build/page";
const fs = require("fs");
const c = require("colors/safe");
fs.existsSync(file) ? fs.unlinkSync(file) : undefined;
console.log(
	c.yellow.bold("Switched to:"),
	c.white.bold.bgCyan(" Single-Page "),
	c.yellow.bold("mode.")
);

// package.json
"page-set": "node build/setpage",
"page-single": "node build/unsetPage",

//csslibs
function msg(w, a) {
	switch (w) {
	case 1:
		log( c.red.bold("The listed file:"), c.white.bold.bgRed(" "+ a +" "), c.red.bold("does not exist!"),
			c.yellow("Looking for a .min of it...") ); break;
	case 2:
		log( c.green("\t Found the .min of it, using it instead."),
			c.white("(Make sure the list in:"), c.blue.bold(a), "is correct.)" ); break;
	case 3:
		log( c.red.bold("No minified file was found either. check the list in:"), c.white.bold.bgRed(a) ); break;
	case 4:
		log( c.green("All libs were copied.") ); break;
	case 5:
		log( "\n", c.green(a), "generated." ); break;
	case 6: 
	case 7: 
	}
}

log( c.red.bold("The listed lib:"), c.white.bold.bgRed(" "+ src +" "), c.red.bold("does not exist!"),
			c.yellow("Looking for a .min of it...")
			);
			let listPath = CONF.L.CSS.slice(3);
			src = CONF.I.SLIBC + i + ".min.css";
			if ( fs.existsSync(src) ) {
				log( c.green("\t Found the .min of it, using it instead."),
					c.white("(Make sure the list in:"), c.blue.bold(listPath), "is correct.)"
				)
				fs.copySync(src, dest);
			} else {
				log( c.red.bold("No minified file was found either. check the list in:"), c.white.bold.bgRed(listPath) );
			}