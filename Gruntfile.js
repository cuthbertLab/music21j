// Gruntfile for music21j 
// Copyright Michael Scott Cuthbert (cuthbert@mit.edu), BSD License


module.exports = function(grunt) {        
    var path = require('path');
    var babel = require('rollup-plugin-babel');
    
    var BANNER = '/**\n' +
                 '  * music21j <%= pkg.version %> built on ' + 
                 '  * <%= grunt.template.today("yyyy-mm-dd") %>.\n' +
                 ' * Copyright (c) 2016 Michael Scott Cuthbert and cuthbertLab\n' +
                 ' *\n' +
                 ' * http://github.com/cuthbertLab/music21j\n' +
                 ' */\n';
    var BASE_DIR = __dirname;
    var BUILD_DIR = path.join(BASE_DIR, 'build');
    var DOC_DIR = path.join(BASE_DIR, 'doc');
    
    var MODULE_ENTRY = path.join(BASE_DIR, 'src/music21.js');
    var TARGET_RAW = path.join(BUILD_DIR, 'music21.debug.js');
    var TARGET_MIN = path.join(BUILD_DIR, 'music21.min.js');
    
    // Project configuration.
    grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),
//	    concat: {
//	        options: {
//	            banner: BANNER,
//	            sourceMap: true
//	        },
////	        tests: {
////	            src: TEST_SOURCES,
////	            dest: TARGET_TESTS
////	        }
//	    },
	    
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
	              }
	        },   
            files: {
                src: MODULE_ENTRY,
                dest: TARGET_RAW
            }
	    },
	    
	    	    
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
	    jsdoc : {
		    dist : {
		        src: ['src/*.js', 'src/music21/*.js', 'README.md'], 
		        options: {
		            destination: DOC_DIR,
		            template : "jsdoc-template",
		            configure : "jsdoc-template/jsdoc.conf.json",
		        },
		    },
	    },
	    qunit: {
	      files: ['tests/index.html']
	    },

	    // raise the versiono number
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
    //grunt.loadNpmTasks('grunt-contrib-concat');
    
    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    
    // Plugin for the jsdoc task
    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task(s).
    grunt.registerTask('default', ['rollup', 'uglify', 'jsdoc']);
    //grunt.registerTask('test', 'Run qunit tests', ['rollup', 'qunit']);
    grunt.registerTask('publish', 'Raise the version and publish', function () { 
        grunt.task.run('bump');
    });

};