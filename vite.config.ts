import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import directoryIndex from 'vite-plugin-directory-index';
import pkg from './package.json';

const banner_lines: string[] = [
    '/*!',
    ' * ',
    ` * music21j version ${pkg.version} built on ${(new Date()).toISOString().split('T')[0]}.`,
    ` * Copyright (c) 2013-${(new Date()).getFullYear()} Michael Scott Asato Cuthbert`,
    ' * BSD License, see LICENSE',
    ' *',
    ' * https://github.com/cuthbertLab/music21j',
    ' * ',
    ' */',
    '',
];

export default defineConfig({
    build: {
        outDir: 'build',
        sourcemap: true,
        emptyOutDir: true,

        // The shipped bundle's browser floor is set HERE, not in tsconfig.json.
        // Vite's default build.target is 'baseline-widely-available' (features
        // in all major browsers for ~30 months), so we leave it unset.
        // target: 'baseline-widely-available',
        // esbuild.target is esnext for speed.
        lib: {
            entry: 'src/main.ts',
            name: 'music21',
            formats: ['umd', 'es'],
            // "debug" is historical -- it is actually minified.
            fileName: format => (format === 'umd') ? 'music21.debug.js' : 'music21.es.js',
        },
        rollupOptions: {
            output: {
                banner: banner_lines.join('\n'),
            },
        },
    },
    clearScreen: false,
    esbuild: {
        legalComments: 'inline',
    },
    plugins: [
        checker({
            typescript: true,
            eslint: {
                lintCommand: 'eslint src/',
                useFlatConfig: true,  // eslint 9+
            },
        }),
        directoryIndex(),
    ],

    // root defaults to process.cwd(), so no need:
    // root: '.',
    server: {
        fs: {
            strict: true,
        },
    },
});
