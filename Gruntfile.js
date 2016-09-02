// Gruntfile for music21j 
// Copyright Michael Scott Cuthbert (cuthbert@mit.edu), BSD License
const path = require('path');

module.exports = (grunt) => {
    const babel = require('rollup-plugin-babel');
    
    const BANNER = '/**\n' +
                 '  * music21j <%= pkg.version %> built on ' + 
                 '  * <%= grunt.template.today("yyyy-mm-dd") %>.\n' +
                 ' * Copyright (c) 2013-2016 Michael Scott Cuthbert and cuthbertLab\n' +
                 ' *\n' +
                 ' * http://github.com/cuthbertLab/music21j\n' +
                 ' */\n';
    const BASE_DIR = __dirname;
    const BUILD_DIR = path.join(BASE_DIR, 'build');
    const DOC_DIR = path.join(BASE_DIR, 'doc');
    
    const MODULE_ENTRY = path.join(BASE_DIR, 'src/loadModules.js');
    const TARGET_RAW = path.join(BUILD_DIR, 'music21.debug.js');
    const TARGET_MIN = path.join(BUILD_DIR, 'music21.min.js');
    
    const SOURCES = ['src/loadModules.js', 'src/music21/*.js']

//    function webpackConfig(target, preset) {
//        return {
//          entry: MODULE_ENTRY,
//          output: {
//            path: '/',
//            filename: target,
//            library: 'Music21',
//            libraryTarget: 'umd',
//          },
//          externals: {
//            'jquery': 'JQuery', 
//            'midi': 'MIDI',
//            'vexflow': 'Vex'
//          },
//          devtool: 'source-map',
//          module: {
//            loaders: [
//              {
//                test: /\.js?$/,
//                exclude: /(node_modules|bower_components|soundfont|soundfonts|midijs|ext|src\/ext)/,
//                loader: 'babel',
//                query: {
//                  presets: [preset],
//                  'plugins': ['add-module-exports', 'transform-object-assign'],
//                },
//              },
//            ],
//          },
//        };
//      }
//    
//    const webpackCommon = webpackConfig(TARGET_RAW, 'es2015');
    //console.log(webpackCommon);
    // Project configuration.
    grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),
	    concat: {
	        options: {
	            banner: BANNER,
	            sourceMap: true
	        },
////	        tests: {
////	            src: TEST_SOURCES,
////	            dest: TARGET_TESTS
////	        }
	    },
        rollup: {
            options: {
                banner: BANNER,
                format: 'umd',
                moduleName: 'music21',
                sourceMap: true,
                sourceMapFile: TARGET_RAW,
                plugins: function() {
                    return [
                      babel({
                        exclude: './node_modules/**'
                      })
                    ];
                  },
                globals: {
                    eventjs: 'eventjs',
                    jquery: '$',
                    jsonpickle: 'jsonpickle',
                    MIDI: 'MIDI',   
                    vexflow: 'Vex',
                },
                external: [
                           'eventjs',
                           'jquery',
                           'jsonpickle',
                           'MIDI',
                           'vexflow',
                           ],                
                paths: {
                    vexflow: './src/ext/vexflow/vexflow-min.js',
                },
            },   
            files: {
                src: MODULE_ENTRY,
                dest: TARGET_RAW
            }
        },
//        webpack: {
//            build: webpackCommon,
//            watch: Object.assign({}, webpackCommon, {
//              watch: true,
//              keepalive: true,
//              failOnError: false,
//              watchDelay: 0,
//            }),
//        },
//	    
	    	    
	    uglify: {
	        options: {
	            banner: BANNER,
	            sourceMap: true
	        },
	        build: {
	            src: TARGET_RAW,
	            dest: TARGET_MIN
	        }
	    },
	    
//	    jsdoc : {
//		    dist : {
//		        src: ['src/*.js', 'src/music21/*.js', 'README.md'], 
//		        options: {
//		            destination: DOC_DIR,
//		            template : "jsdoc-template",
//		            configure : "jsdoc-template/jsdoc.conf.json",
//		        },
//		    },
//	    },
	    eslint: {
	        target: SOURCES,
	        options: {
	          configFile: '.eslintrc.json',
	        },
	    },
	    qunit: {
	      files: ['tests/gruntTest.html']
	    },
	     watch: {
	         scripts: {
	           files: ['src/*', 'src/music21/*', 'Gruntfile.js'],
	           tasks: ['rollup'],
	           options: {
	             interrupt: true
	           }
	         },
//	         tests: {
//	           files: ['tests/*'],
//	           tasks: ['concat:tests'],
//	           options: {
//	             interrupt: true
//	           }
//	         }
	       },	    
	    // raise the version number
	    bump: {
	        options: {
	          files: ['package.json'], // 'component.json'],
	          commitFiles: ['package.json'], // 'component.json'],
	          updateConfigs: ['pkg'],
	          createTag: false,
	          push: false
	        }
	    },
	    
	});

    grunt.loadNpmTasks('grunt-rollup');
    grunt.loadNpmTasks('grunt-contrib-concat');
       
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    
    // Plugin for the jsdoc task
    //grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-eslint');
//    grunt.loadNpmTasks('grunt-webpack');

    // Default task(s).
    grunt.registerTask('default', ['rollup', 'uglify:build']); //, 'eslint', ... 'jsdoc']); 
    //grunt.registerTask('default', ['webpack:build', 'concat', 'uglify:build']); //, 'jsdoc']);
    grunt.registerTask('test', 'Run qunit tests', ['rollup', 'qunit']);
    grunt.registerTask('publish', 'Raise the version and publish', function () { 
        grunt.task.run('bump');
    });

};