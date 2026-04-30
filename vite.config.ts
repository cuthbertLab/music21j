import { defineConfig, type Plugin } from 'vite';
import checker from 'vite-plugin-checker';
import directoryIndex from 'vite-plugin-directory-index';
import pkg from './package.json';
import { buildNoLocalFontsCss } from './tests/no_local_fonts';

// AI-assisted
//
// When NO_LOCAL_FONTS=1 is set in the environment, inject the same
// @font-face blocker the playwright runner uses into every served HTML page.
// Lets a developer run `NO_LOCAL_FONTS=1 npm run dev` and visit
// http://localhost:5173/tests/ to see what users without Bravura installed
// locally see, instead of being masked by their own system copy.
function noLocalFontsPlugin(): Plugin | undefined {
    if (!process.env.NO_LOCAL_FONTS) {
        return undefined;
    }
    const css = buildNoLocalFontsCss();
    return {
        name: 'm21j-no-local-fonts',
        apply: 'serve',
        transformIndexHtml() {
            return [{
                tag: 'style',
                attrs: { 'data-m21j-font-blocker': '' },
                injectTo: 'head-prepend',
                children: css,
            }];
        },
    };
}

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

        // this is the default.
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
        noLocalFontsPlugin(),
    ],

    // root defaults to process.cwd(), so no need:
    // root: '.',
    server: {
        fs: {
            strict: true,
        },
    },
});
