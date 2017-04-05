var getLibs = require("./build/libs.js");


module.exports = function (grunt) {
	grunt.loadNpmTasks("grunt-shell");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-watch");
	
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		shell: {
			options: {
				stderr: false
			},
			templates: {
				command: "npm run compile-temps"
			}
		},
		watch: {
			gruntfile: {
				files: ["gruntfile.js" ],
				options: {
					spawn: false,
					reload: true
				}
			},
			temps: {
				files: ["src/template/dynamic/**/*.hbs"],
				tasks: ["shell:templates"]
			},
			livereload: {
				options: { livereload: true },
				files: [
					"!**/node_modules/**",
					"!**/.git/**",
					"dist/index.htm",
					"dist/css/**/*.css",
					"dist/js/app/**/*.js"
				]
			}
		}
	});
	grunt.registerTask("temps", ["shell:templates"]);
	grunt.registerTask("libs", function () {
		grunt.config.set("concat", {
			options: {
				separator: "\n",
			},
			dist: {
				src: getLibs( grunt.option("min") === true ), // ["", "", ""]
				dest: getLibs.DEST_FILE, // ""
			}
		});
		grunt.task.run("concat");
	});
	grunt.registerTask("default", ["watch"]);
};