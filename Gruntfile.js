// Gruntfile for music21j
// Copyright Michael Scott Cuthbert (cuthbert@mit.edu), BSD License
const path = require('path');
const webpack = require('webpack');

module.exports = grunt => {

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
    const WATCH_SOURCES = SOURCES.concat(['Gruntfile.js']);

    const TEST_ENTRY = path.join(TEST_DIR, 'loadAll.js');
    const TEST_SOURCES = ['tests/loadAll.js', 'tests/moduleTests/*.js', 'tests/moduleTests/*/*.js'];
    const TARGET_TESTS = path.join(BUILD_DIR, 'music21.tests.js');

    const webpackConfig = (target, preset) => {
        return {
            entry: './src/music21_modules.js',  // MODULE_ENTRY,
            output: {
                path: BUILD_DIR,
                filename: target,
                library: 'music21',
                libraryTarget: 'umd',
                umdNamedDefine: true,
            },
            mode: 'development',
            devtool: 'inline-source-map',
            module: {
                rules: [
                    {
                        test: /\.js?$/,
                        exclude: /(node_modules|bower_components|src\/ext)/,
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
        '@babel/preset-env',
    );
    const webpackTests = webpackConfig(
        'music21.tests.js',
        '@babel/preset-env',
    );
    webpackTests.entry = './tests/loadAll.js';
    webpackTests.output.path = TEST_DIR;
    webpackTests.output.library = 'm21Tests';
    // webpackTests.cache = true;

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        webpack: {
            build: webpackCommon,
            dev: Object.assign({ watch: true }, webpackCommon),
            test: webpackTests,
        },
        jsdoc: {
            dist: {
                src: ['src/music21_modules.js', 'src/music21/*.js', 'src/music21/*/*.js', 'README.md'],
                options: {
                    destination: DOC_DIR,
                    template: 'jsdoc-template',
                    configure: 'jsdoc-template/jsdoc.conf.json',
                    // that json document has most of the config options
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
            files: ['tests/gruntTest.html']
        },
        watch: {
            scripts: {
                files: WATCH_SOURCES,
                tasks: ['webpack:build', 'eslint'],
                options: {
                    interrupt: true,
                },
            },
            test: {
                files: TEST_SOURCES.concat(WATCH_SOURCES),
                tasks: ['test_no_watch'],
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

    grunt.loadNpmTasks('grunt-webpack');

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    // Plugin for the jsdoc task
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-eslint');

    // Default task(s).
    grunt.registerTask('default', ['eslint', 'webpack:build']);
    grunt.registerTask('test', 'Watch qunit tests', ['watch:test']);
    grunt.registerTask('test_no_watch', 'Watch qunit tests', ['webpack:test', 'qunit']);
    grunt.registerTask('publish', 'Raise the version and publish', () => {
        grunt.task.run('jsdoc');
        grunt.task.run('bump');
    });
};
