var getLibs = require("./libs.js");

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		watch: {
			scripts: {
				files: [
					"!**/node_modules/**",
					"!**/.git/**",
					"index.htm",
					"css/**/*.css",
					"js/dist/**/*.js",
					"gruntfile.js",
					"test/**/*"
				],
				tasks: [],
				options: {
					spawn: false,
					reload: true
				}
			},
			livereload: {
				options: { livereload: true },
				files: [
					"!**/node_modules/**",
					"!**/.git/**",
					"index.htm",
					"css/**/*.css",
					"js/dist/**/*.js",
					"test/**/*"
				]
			}
		}
	});
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-watch");
	
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