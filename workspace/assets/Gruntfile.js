/*global module:false, require:false*/
var md = require('matchdep');

module.exports = function (grunt) {

	'use strict';
	
	var GRUNT_FILE = 'Gruntfile.js';
	
	var BUILD_FILE = './build.json';
	
	var LESS_FILE = 'css/main.less';
	
	var JSON_JS_FILE = grunt.file.readJSON('./js.json');
	
	var fixJsFilePath = function (f) {
		return './js/' + f;
	};
	
	var SRC_FILES = JSON_JS_FILE.sources.map(fixJsFilePath);
	
	var LIB_FILES = JSON_JS_FILE.libs.map(fixJsFilePath);
	
	var TEST_FILES = ['js/tests/*.js'];
	
	var config = {
		pkg: grunt.file.readJSON('package.json'),
		buildnum: {
			options: {
				file: BUILD_FILE
			}
		},
		meta: {
			banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> ' +
			'- build <%= buildnum.num %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
			'<%= pkg.author.name %> (<%= pkg.author.url %>);\n' +
			'* Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n'
		},
		concat: {
			options: {
				process: true
			},
			sources: {
				src: SRC_FILES,
				dest: 'js/<%= pkg.name %>.js'
			},
			libs: {
				src: LIB_FILES.concat(['js/<%= pkg.name %>.min.js']),
				dest: '<%= concat.libs.src[concat.libs.src.length - 1] %>'
			}
		},
		
		watch: {
			files: SRC_FILES.concat(GRUNT_FILE),
			tasks: ['dev', 'css']
		},
		
		jshint: {
			files: SRC_FILES.concat(GRUNT_FILE),
			options: {
				bitwise: false,
				camelcase: false,
				curly: true,
				eqeqeq: false, // allow ==
				forin: true,
				//freeze: true,
				immed: false, //
				latedef: true, // late definition
				newcap: true, // capitalize ctos
				noempty: true,
				nonew: true, // no new ..()
				noarg: true, 
				plusplus: false,
				quotmark: 'single',
				undef: true,
				maxparams: 5,
				maxdepth: 5,
				maxstatements: 30,
				maxlen: 100,
				//maxcomplexity: 10,
				
				// relax options
				//boss: true,
				//eqnull: true, 
				esnext: true,
				regexp: true,
				strict: true,
				trailing: false,
				sub: true, // [] notation
				smarttabs: true,
				lastsemic: false, // enforce semicolons
				white: true,
				
				// env
				browser: true,
				
				globals: {
					jQuery: true,
					console: true,
					App: true,
					Loader: true
				}
			}
		},
		uglify: {
			prod: {
				files: {
					'js/<%= pkg.name %>.min.js': '<%= concat.sources.dest %>' 
				}
			},
			options: {
				banner: '<%= meta.banner %>',
				report: 'gzip',
				sourceMap: true,
				sourceMapName: 'js/<%= pkg.name %>.min.js.map',
				mangle: true,
				compress: {
					global_defs: {
						DEBUG: false
					},
					dead_code: true,
					unused: true,
					warnings: true
				}
			}
		},
		
		less: {
			development: {
				files: {
					'css/main.css': LESS_FILE
				}
			},
			production: {
				options: {
					cleancss: true,
					report: 'gzip',
					sourceMap: true,
					sourceMapFilename: 'css/main.min.css.map',
					sourceMappingURL: 'main.min.css.map'
				},
				files: {
					'css/main.min.css': LESS_FILE
				}
			}
		},
		
		usebanner: {
			build: {
				options: {
					position: 'top',
					banner: '<%= meta.banner %>',
					linebreak: true
				},
				files: {
					src: [ 'css/main.min.css' ]
				}
			}
		},
		
		complexity: {
			generic: {
				src: SRC_FILES,
				options: {
					//jsLintXML: 'report.xml', // create XML JSLint-like report
					errorsOnly: false, // show only maintainability errors
					cyclomatic: 10, // 3
					halstead: 17, // 8
					maintainability: 95 //100
				}
			}
		},
		
		analyzecss: {
			prod: {
				sources: [
					'css/main.min.css'
				]
			},
			options: {
				error: 0.72,
				outputMetrics: 'warn',
				thresholds: {
					
				}
			}
		},
		
		csslint: {
			options: {
				// errors
				import: 2,
				
				// warnings
				'font-sizes': true,
				'unqualified-attributes': true,
				
				// disable
				important: false,
				'unique-headings': false,
				ids: false,
				'box-model': false,
				'universal-selector': false,
			},
			src: ['css/main.css']
		},
		
		clean: {
			copy: {
				options: {
					force: true
				},
				src: ['../../../dist/**']
			}
		},
		
		copy: {
			main: {
				files: [{
					expand: true,
					cwd: '../../',
					src: ['**', '.htaccess'],
					dest: '../../../dist/',
					filter: 'isFile'
				}],
				options: {
					processContentExclude: [
						'**/img/*.{png,gif,jpg,ico,psd}',
						'**/symphony/*.{png,gif,jpg,ico,psd}',
						'**/extensions/*.{png,gif,jpg,ico,psd}'
					],
					processContent: function (content, srcpath) {
						var r = [
							/Gruntfile\.js/g, 
							/package\.json/g, 
							/node_modules(.*)/g, 
							/\/js\/com\/(.*)\.js/g, 
							/\/js\/modules\/(.*)\.js/g, 
							/\/js\/pages\/(.*)\.js/g, 
							/\/js\/transitions\/(.*)\.js/g, 
							/\/js\/utils\/(.*)\.js/g, 
							/\/css\/(.*)\.less/g
						];
						var res = true;
						r.forEach(function (re) {
							if (re.test(srcpath)) {
								res = false;
								return false; // break;
							}
							return true;
						});
						return res ? content : res;
					}
				}
			}
		}
	};
	
	var init = function (grunt) {
		grunt.file.preserveBOM = true;
		
		// Project configuration.
		grunt.initConfig(config);

		// generate build number
		grunt.registerTask('buildnum', 
			'Generates and updates the current build number', function () {
			var options = this.options();
			var getBuildNumber = function () {
				var b = {};
				
				try {
					b = grunt.file.readJSON(options.file);
				} catch (e) {}
				
				b.lastBuild = b.lastBuild > 0 ? b.lastBuild + 1 : 1;
				
				grunt.file.write(options.file, JSON.stringify(b));
				
				return b.lastBuild;
			};
			
			var buildnum = getBuildNumber();
			grunt.config.set('buildnum.num', buildnum);
			grunt.log.writeln('New build num:', buildnum);
			grunt.log.writeln('For version:', config.pkg.version);
		});

		// Default tasks.
		grunt.registerTask('dev',     ['jshint', 'complexity']);
		grunt.registerTask('js',      ['concat:sources', 'uglify', 'concat:libs']);
		grunt.registerTask('css',     ['less', 'usebanner', 'analyzecss', 'csslint']);
		grunt.registerTask('build',   ['buildnum', 'js', 'css']);
		grunt.registerTask('dist',    ['clean:copy', 'build', 'copy']);
		grunt.registerTask('default', ['dev', 'build']);
	};
	
	var load = function (grunt) {
		md.filterAll('grunt-*').forEach(grunt.loadNpmTasks);
		
		init(grunt);
	};
	
	load(grunt);
};