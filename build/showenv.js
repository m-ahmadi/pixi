const fs = require("fs");
const c = require("colors/safe");
const v = fs.readFileSync("build/env", "utf8");
console.log( c.white.bold("Current environment:"), c.black.bgWhite(` ${v} `) );