// Gruntfile for music21j
// Copyright Michael Scott Cuthbert (cuthbert@mit.edu), BSD License
const path = require('path');
const webpack = require('webpack');

jqueryResolved = path.resolve('./src/ext/jquery/jquery/jquery-3.2.1.min.js');

module.exports = grunt => {
    const babel = require('rollup-plugin-babel');

    const BANNER
        = '/**\n'
        + ' * music21j <%= pkg.version %> built on <%= grunt.template.today("yyyy-mm-dd") %>.\n'
        + ' * Copyright (c) 2013-<%= grunt.template.today("yyyy") %> Michael Scott Cuthbert and cuthbertLab\n'
        + ' * BSD License, see LICENSE\n'
        + ' *\n'
        + ' * http://github.com/cuthbertLab/music21j\n'
        + ' */\n';
    const BASE_DIR = __dirname;
    const BUILD_DIR = path.join(BASE_DIR, 'build');
    const DOC_DIR = path.join(BASE_DIR, 'doc');
    const TEST_DIR = path.join(BASE_DIR, 'tests');

    const MODULE_ENTRY = path.join(BASE_DIR, 'src/music21_modules.js');
    const TARGET_RAW = path.join(BUILD_DIR, 'music21.debug.js');
    const TARGET_RAW_MAP = TARGET_RAW + '.map';
    const TARGET_MIN = path.join(BUILD_DIR, 'music21.min.js');

    const SOURCES = ['src/music21_modules.js', 'src/music21/*.js', 'src/music21/*/*.js'];

    const TEST_ENTRY = path.join(TEST_DIR, 'loadAll.js');
    const TEST_SOURCES = ['tests/loadAll.js', 'tests/moduleTests/*.js'];
    const TARGET_TESTS = path.join(BUILD_DIR, 'music21.tests.js');

    function webpackConfig(target, preset) {
         return {
             entry: './src/music21_modules.js',  // MODULE_ENTRY,
             output: {
                 path: BUILD_DIR,
                 filename: target,
                 library: 'music21',
                 libraryTarget: 'umd',
                 umdNamedDefine: true,
             },
             devtool: 'inline-source-map',
             module: {
                 rules: [
                     {
                      test: /\.js?$/,
                      exclude: /(node_modules|bower_components|soundfont|soundfonts|src\/ext)/,
                      use: [{
                          loader: 'babel-loader',
                          options: {
                              presets: [preset],
                              plugins: [
                                  '@babel/plugin-transform-object-assign',
                                  '@babel/plugin-proposal-export-namespace-from',
                              ],
                              // plugins: ['add-module-exports', 'transform-object-assign'],
                          },
                      }],
                    },
                    {
                        test: /\.css$/i,
                        use: ['style-loader', 'css-loader'],
                    },
                 ],
             },
             plugins: [
                new webpack.BannerPlugin({banner: BANNER, raw: true}),
             ],
         };
    }

    const webpackCommon = webpackConfig(
        'music21.debug.js',  // TARGET_RAW,
        '@babel/preset-env'
    );
    // console.log(webpackCommon);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                banner: BANNER,
                sourceMap: true,
            },
            tests: {
                src: TEST_SOURCES,
                dest: TARGET_TESTS,
            },
        },
        rollup: {
            options: {
                banner: BANNER,
                format: 'umd',
                moduleName: 'music21',
                sourceMap: true,
                sourceMapFile: TARGET_RAW,
                plugins() {
                    return [
                        babel({
                            exclude: './node_modules/**',
                        }),
                    ];
                },
                globals: {
                    jsonpickle: 'jsonpickle',
                    MIDI: 'MIDI',
                    qunit: 'QUnit',
                },
                external: [
                    'jsonpickle',
                    'MIDI',
                    'qunit',
                ],
                paths: {
                    qunit: './tests/qQunit/qunit-2.0.1.js',
                },
            },
            files: {
                src: MODULE_ENTRY,
                dest: TARGET_RAW,
            },
            tests: {
                src: TEST_ENTRY,
                dest: TARGET_TESTS,
            },
        },
        webpack: {
             build: webpackCommon,
             watch: Object.assign({}, webpackCommon, {
                 watch: true,
                 watchOptions: {
                     keepalive: true,
                     failOnError: false,
                 },
             }),
         },

        uglify: {
            options: {
                banner: BANNER,
                sourceMap: true,
		sourceMapIn: TARGET_RAW_MAP,
            },
            build: {
                src: TARGET_RAW,
                dest: TARGET_MIN,
            },
        },

        jsdoc: {
            dist: {
                src: ['src/*.js', 'src/music21/*.js', 'src/music21/*/*.js', 'README.md'],
                options: {
                    destination: DOC_DIR,
                    template: 'jsdoc-template',
                    configure: 'jsdoc-template/jsdoc.conf.json',
                },
            },
        },
        eslint: {
            target: SOURCES,
            options: {
                configFile: '.eslintrc.json',
            },
        },
        qunit: {
            files: ['tests/gruntTest.html'],
        },
        watch: {
            scripts: {
                files: ['src/*', 'src/music21/*', 'src/music21/*/*.js', 'Gruntfile.js'],
                tasks: ['rollup', 'eslint'],
                options: {
                    interrupt: true,
                },
            },
            test: {
                files: ['tests/*', 'tests/moduleTests/*.js', 'tests/moduleTests/*/*.js'],
                tasks: ['test'],
                options: {
                    interrupt: true,
                },
            },
        },
        // raise the version number
        bump: {
            options: {
                files: ['package.json'], // 'component.json'],
                commitFiles: ['package.json'], // 'component.json'],
                updateConfigs: ['pkg'],
                createTag: false,
                push: false,
            },
        },
    });

    grunt.loadNpmTasks('grunt-rollup');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-webpack');

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    // Plugin for the jsdoc task
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-eslint');

    // Default task(s).
    grunt.registerTask('default', ['eslint', 'webpack:build']);
    grunt.registerTask('test', 'Run qunit tests', ['rollup:tests', 'qunit']);
    grunt.registerTask('publish', 'Raise the version and publish', () => {
        grunt.task.run('jsdoc');
        grunt.task.run('bump');
    });
};
