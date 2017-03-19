var getLibs = require("./libs.js");

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
				command: "handlebars template/dynamic/ > js/src/templates.js -e hbs -m"
			}
		},
		watch: {
			temps: {
				files: ["template/dynamic/**/*.hbs"],
				tasks: ["shell:templates"]
			},
			livereload: {
				options: { livereload: true },
				files: [
					"!**/node_modules/**",
					"!**/.git/**",
					"index.htm",
					"css/**/*.css",
					"js/dist/**/*.js",
					"template/dynamic/**/*.hbs",
					"test/**/*"
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