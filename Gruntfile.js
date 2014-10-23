module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),
	    uglify: {
	        options: {
	            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
	        },
	        build: {
	            src: 'src/music21.js',
	            dest: 'build/music21.min.js'
	        }
	    },
	    jsdoc : {
		    dist : {
		        src: ['src/*.js', 'src/music21/*.js', 'README.md'], 
		        options: {
		            destination: 'doc',
		            template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
		            configure : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json",
		        },
		    },
	    }
	});

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsdoc');
    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};