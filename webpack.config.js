// Webpack config for music21j
// Copyright (c) 2025 Michael Scott Asato Cuthbert
// (michael.asato.cuthbert@gmail.com),
// BSD License

// this WILL Become the main build system during 2025, but it is NOT yet.  Still use grunt.

const path = require('path');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const { spawn } = require('child_process');

const package_json = require('./package.json');

const BANNER = `/**\n * music21j version ${package_json.version} built on ${(new Date()).toISOString().split('T')[0]}.\n * Copyright (c) 2013-${(new Date()).getFullYear()} Michael Scott Asato Cuthbert\n * BSD License, see LICENSE\n *\n * https://github.com/cuthbertLab/music21j\n */\n`;

const babel_loader = babel_presets => ({
    loader: 'babel-loader',
    options: {
        presets: babel_presets,
        plugins: [
            '@babel/plugin-transform-object-assign',
            '@babel/plugin-transform-export-namespace-from',
            '@babel/plugin-proposal-class-properties',
        ],
    },
});

const babel_preset = [
    [
        '@babel/preset-env',
        {
            debug: false,
            modules: false,  // do not transform modules; let webpack do it
            targets: {
                browsers: [
                    'last 2.5 years',
                    'not < 0.04% in US',
                    'not safari < 10',
                    'not android < 80',  // bug in browserslist
                    'not ios <= 10',
                    'not ie <= 12',
                ],
            },
            useBuiltIns: 'usage',
            corejs: 3,
        },
    ]
];

class QUnitInWatch {
    apply(compiler) {
        compiler.hooks.done.tap('QUnitInWatch', () => {
            const _child = spawn('npx', ['qunit', 'tests/gruntTest.html'], {
                stdio: 'inherit',
                shell: true,
            });
        });
    }
}

module.exports = [
    // Main build
    {
        entry: './src/main.ts',
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'music21.debug.js',
            library: 'music21',
            libraryTarget: 'umd',
            umdNamedDefine: true,
        },
        mode: 'production',
        devtool: 'source-map',
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: [
                        babel_loader(babel_preset),
                        { loader: 'ts-loader' },
                    ],
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|src\/ext)/,
                    use: [babel_loader(babel_preset)],
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
            ],
        },
        plugins: [
            new webpack.BannerPlugin({ banner: BANNER, raw: true }),
            new ESLintPlugin({ failOnError: false, extensions: ['ts', 'js'] }),
        ],
    },
    // Test build
    {
        entry: './tests/loadAll.ts',
        output: {
            path: path.resolve(__dirname, 'tests'),
            filename: 'music21.tests.js',
            library: 'm21Tests',
            libraryTarget: 'umd',
            umdNamedDefine: true,
        },
        mode: 'development',
        devtool: 'eval-source-map',
        watch: true,
        resolve: {
            extensions: ['.ts', '.js'],
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: [
                        babel_loader(babel_preset),
                        { loader: 'ts-loader' },
                    ],
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|src\/ext)/,
                    use: [babel_loader(babel_preset)],
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
            ],
        },
        plugins: [
            new webpack.BannerPlugin({ banner: BANNER, raw: true }),
            new ESLintPlugin({ failOnError: false, extensions: ['ts', 'js'] }),
            new QUnitInWatch(),
        ],
    },
];
