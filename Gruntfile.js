// Gruntfile for music21j
// Copyright Michael Scott Asato Cuthbert (cuthbert@mit.edu), BSD License
const path = require('path');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const package_json = require('./package.json');

module.exports = grunt => {

    const BANNER
        = '/**\n'
        + ' * music21j version ' + package_json.version + ' built on '
        + (new Date()).toISOString().split('T')[0] + '.\n'
        + ' * Copyright (c) 2013-' + (new Date()).getFullYear() + ' '
        + 'Michael Scott Asato Cuthbert\n'
        + ' * BSD License, see LICENSE\n'
        + ' *\n'
        + ' * http://github.com/cuthbertLab/music21j\n'
        + ' */\n';
    const BASE_DIR = __dirname;
    const BUILD_DIR = path.join(BASE_DIR, 'build');
    const DOC_DIR = path.join(BASE_DIR, 'doc');
    const TEST_DIR = path.join(BASE_DIR, 'tests');

    // const MODULE_ENTRY = path.join(BASE_DIR, 'src/music21_modules.js');
    // const TARGET_RAW = path.join(BUILD_DIR, 'music21.debug.js');
    // const TARGET_RAW_MAP = TARGET_RAW + '.map';
    // const TARGET_MIN = path.join(BUILD_DIR, 'music21.min.js');

    const SOURCES = [
        'src/*.ts',
        'src/*/*.ts',
    ];
    const WATCH_SOURCES = SOURCES.concat(['Gruntfile.js']);

    const TEST_ENTRY = path.join(TEST_DIR, 'loadAll.ts');
    const TEST_SOURCES = [
        'tests/loadAll.ts',
        'tests/moduleTests/*.ts',
        'tests/moduleTests/*/*.ts',
    ];
    // const TARGET_TESTS = path.join(BUILD_DIR, 'music21.tests.js');

    const babel_loader = babel_presets => {
        return {
            loader: 'babel-loader',
            options: {
                presets: babel_presets,
                plugins: [
                    '@babel/plugin-transform-object-assign',
                    '@babel/plugin-proposal-export-namespace-from',
                    '@babel/plugin-proposal-class-properties',
                ],
            },
        };
    };


    const webpackConfig = (target, preset) => {
        // noinspection JSUnresolvedFunction
        return {
            entry: './src/main.ts',  // MODULE_ENTRY,
            output: {
                path: BUILD_DIR,
                filename: target,
                library: 'music21',
                libraryTarget: 'umd',
                umdNamedDefine: true,
            },
            cache: {
                type: 'memory',
            },
            mode: 'development',
            devtool: 'source-map',
            watch: true,
            resolve: {
                extensions: ['.ts', '.js'],
            },
            module: {
                rules: [
                    {   // typescript --> transpile to es6 using ts-loader,
                        // then babel to our target
                        test: /\.ts$/,
                        exclude: /node_modules/,
                        use: [
                            babel_loader(preset),
                            { loader: 'ts-loader' },
                        ],
                    },
                    {
                        test: /\.js$/,
                        exclude: /(node_modules|src\/ext)/,
                        use: [
                            babel_loader(preset)
                        ],
                    },
                    {
                        test: /\.css$/i,
                        use: ['style-loader', 'css-loader'],
                    },
                ],
            },
            plugins: [
                new webpack.BannerPlugin({banner: BANNER, raw: true}),
                new ESLintPlugin(
                    {
                        failOnError: false,
                        emitWarning: true,
                        extensions: ['ts', 'js'],
                    }
                ),
            ],
        };
    };

    const babel_preset = [
        [
            '@babel/preset-env',
            {
                debug: false,
                modules: false,  // do not transform modules; let webpack do it
                targets: {
                    browsers: [
                        'last 4 years',
                        'not < 0.04% in US',
                        'not firefox < 39',
                        'not safari < 10',
                        'not chrome < 49',
                        'not android < 80',  // bug in browserslist
                        'not ios <= 10',
                        'not samsung <= 4',
                        'not ie <= 12',  // all versions -- edge is separate
                    ],
                },
                useBuiltIns: 'usage',
                corejs: 3,
            },
        ]
    ];

    const webpackCommon = webpackConfig(
        'music21.debug.js',  // TARGET_RAW,
        babel_preset,
    );
    const webpackTests = webpackConfig(
        'music21.tests.js',
        babel_preset,
    );
    webpackTests.entry = TEST_ENTRY;
    webpackTests.output.path = TEST_DIR;
    webpackTests.output.library = 'm21Tests';
    webpackTests.watch = false;
    // webpackTests.cache = true;

    // Project configuration.
    // noinspection JSUnresolvedFunction
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        webpack: {
            build: Object.assign({
                mode: 'production',
            }, webpackCommon),
            dev: Object.assign({
                mode: 'development',
            }, webpackCommon),
            test: webpackTests,
        },
        jsdoc: {
            dist: {
                src: [
                    'src/music21/*.ts',
                    'src/music21/*/*.ts',
                    'README.md',
                ],
                options: {
                    destination: DOC_DIR,
                    template: 'jsdoc-template',
                    configure: 'jsdoc-template/jsdoc.conf.json',
                    // that json document has most of the config options
                },
            },
        },
        eslint: {
            target: SOURCES.concat(TEST_SOURCES),
            options: {
                overrideConfigFile: '.eslintrc.json',
            },
        },
        qunit: {
            files: ['tests/gruntTest.html'],
        },
        watch: {
            scripts: {
                files: WATCH_SOURCES,
                tasks: ['webpack:build'],
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
    grunt.registerTask('default', ['webpack:build']);
    grunt.registerTask('test', 'Watch qunit tests', ['watch:test']);
    grunt.registerTask('test_no_watch', 'Run qunit tests', ['webpack:test', 'qunit']);
    grunt.registerTask('publish', 'Raise the version and publish', () => {
        grunt.task.run('jsdoc');
        grunt.task.run('bump');
    });
};
