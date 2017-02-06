var libs = require('./js/libs');

module.exports = function(grunt) {
	
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				options: {
					style: 'expanded' // nested compact compressed
				},
				files: {
					'css/style.css': 'sass/style.scss'
				}
			}
		},
		jshint: {
			options: {
				reporter: require('jshint-stylish'),
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true,
				globals: {
					jQuery: true
				}
			},
			uses_defaults: [
				'js/**/*.js',
				'!js/lib/**/*'
				//'!js/app/**/*'
			]
			//beforeconcat: ['public/js/app/**/*.js'],
			//afterconcat: ['public/js/app.js']
		},
		jslint: {
			client: {
				src: [
					'js/fn.js'
				],
				directives: {
					browser: true,
					predef: [
						'jQuery', '$', 'PIXI', 'util', 'window', 'document', 'coPubsub'
					]
				}
			}
		},
		
		concat: {
			options: {
			  separator: '\n',
			},
			dist: {
				src: libs.list,
				dest: libs.dest,
			}
		},
		
		
		/*
		browserify: {
			all: {
				files: {
					"js/bundle.js": ["js/src/main.ts"]
				},
				options: {
					watch: true,
					plugin: ['tsify']
				}
			},
			
		},
		*/
		
		/*
		webpack: {
			default: {
				entry: {
					main: './js/src/main.js'
				},
				output: {
					filename: 'bundle.js',
					path: './js/dist'
				}
			}
		},
		*/
		watch: {
			scripts: {
				files: [
					'sass/**/*.scss',
					'css/**/*.css',
					'js/**/*.js',
					'gruntfile.js',
					'test/**/*'
				],
				tasks: ['sass'], // 'webpack', 'jslint', 'browserify', 'jshint', 'concat'
				options: {
					spawn: false,
					reload: true
				}
			},
			livereload: {
				options: { livereload: true },
				files: [
					'**/*.htm',
					'sass/**/*.scss',
					'css/**/*.css',
					'js/**/*.js',
					'*.js',
					'test/**/*'
				]
			}
		}
	});
	
	// grunt.loadNpmTasks('grunt-webpack');
//	grunt.loadNpmTasks('grunt-jslint');
//	grunt.loadNpmTasks('grunt-browserify');
	
	grunt.loadNpmTasks('grunt-contrib-sass');
//	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	
	grunt.registerTask('libs', ['concat']);
	grunt.registerTask('default', ['watch']);
};