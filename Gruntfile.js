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
		    src: ['src/*.js', 'src/music21/*.js'], 
		    options: {
			destination: 'doc'
		    }
		}
	    }
	});

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsdoc');
    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};