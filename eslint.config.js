// keeping this as a commonJS file for now -- PyCharm goes crazy if we make it
// a .mjs file -- thinks everything ending in js is then one.
const globals = require('globals');
const { configs: airbnb } = require('eslint-config-airbnb-extended/legacy');
const eslint_parser = require('@typescript-eslint/parser');
const eslint_plugin = require('@typescript-eslint/eslint-plugin');

const no_unused_vars_config = [
    'warn',
    {
        args: 'none',
        caughtErrors: 'none',
        varsIgnorePattern: '^_.*|^i$|^j$|^unused|^junk|^counter',
    },
];


module.exports = [
    ...airbnb.base.recommended,  // this is the flat-eslint version of airbnb-base
    {
        ignores: ['releases/*', 'build/*', 'node_modules/*'],
        files: ['**/*.js', '**/*.ts'],   // tsx would go here, etc.
        languageOptions: {
            ecmaVersion: 'latest',
            globals: {
                ...globals.browser,
                ...globals.jquery,
                ...globals.es2026,  // this should be the latest in globals, not what we transpile to.
            },
        },
        rules: {
            'array-bracket-spacing': ['off'],
            'arrow-body-style': ['off'],
            'arrow-parens': ['off'],
            'brace-style': ['off'],
            'camelcase': ['off'],
            'class-methods-use-this': ['off'],
            'comma-dangle': ['warn', {
                arrays: 'only-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'ignore',
            }],
            'curly': ['warn', 'all'],
            'dot-location': ['warn', 'property'],
            'dot-notation': ['error'],
            'function-paren-newline': ['warn', 'consistent'],
            'indent': ['warn', 4, {
                ignoredNodes: ['TemplateLiteral *'],
            }],
            'import/extensions': ['off'],
            'import/prefer-default-export': ['off'],
            'import/no-named-as-default': ['off'],
            'import/no-named-as-default-member': ['off'],
            'import/no-unresolved': ['off'],
            'import/no-extraneous-dependencies': ['off'],
            'linebreak-style': ['off'],
            'lines-between-class-members': ['warn', 'always', {
                exceptAfterSingleLine: true,
            }],
            'max-classes-per-file': ['off'],
            'max-len': [
                'warn', {
                    code: 120,
                    ignoreUrls: true,
                    ignoreTemplateLiterals: true,
                    ignoreTrailingComments: true,
                },
            ],
            'new-cap': ['off'],
            'no-case-declarations': ['error'],
            'no-console': ['off'],
            'no-continue': ['off'],
            'no-confusing-arrow': ['off'],
            'no-else-return': ['off'],
            'no-floating-decimal': ['warn'],
            'no-lonely-if': ['off'],
            'no-mixed-operators': ['off'],
            'no-multi-spaces': ['off'],
            'no-multiple-empty-lines': ['warn', { max: 3 }],
            'no-param-reassign': ['off'],
            'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
            'no-promise-executor-return': ['off'],
            'no-restricted-syntax': [
                2,
                'DebuggerStatement',
                'LabeledStatement',
                'WithStatement',
            ],
            'no-return-assign': ['warn', 'except-parens'],
            'no-shadow': ['off'],
            'no-trailing-spaces': ['off'],
            'no-use-before-define': ['off'],
            'no-underscore-dangle': ['off'],
            'no-unused-vars': no_unused_vars_config,
            'no-useless-return': ['warn'],
            'object-curly-spacing': ['off'],
            'object-curly-newline': ['warn', {
                ObjectExpression: { multiline: true, minProperties: 5, consistent: true },
                ObjectPattern: { multiline: true, minProperties: 5, consistent: true },
                ImportDeclaration: { multiline: true, minProperties: 5, consistent: true },
                ExportDeclaration: { multiline: true, minProperties: 5, consistent: true },
            }],
            'object-property-newline': ['off'],
            'object-shorthand': ['off'],
            'operator-linebreak': ['off'],
            'padded-blocks': ['off'],
            'prefer-const': [
                'warn',
                {
                    'destructuring': 'all',
                }
            ],
            'prefer-destructuring': ['off'],
            'prefer-object-spread': ['warn'],
            'prefer-regex-literals': ['off'],
            'prefer-template': ['off'],
            'quote-props': ['off'],
            'quotes': ['warn'],
            'radix': ['off'],
            'semi-style': ['warn'],
            'space-infix-ops': ['off'],
            'spaced-comment': ['off'],
            'strict': ['error', 'global'],
            'yoda': ['error', 'never', { exceptRange: true }],
        },
    },
    {
        // formerly "overrides"
        files: ['**/*.ts'],
        plugins: {
            '@typescript-eslint': eslint_plugin,
        },
        languageOptions: {
            parser: eslint_parser,
        },
        rules: {
            '@typescript-eslint/no-unused-vars': no_unused_vars_config,
            'no-undef': 'off',
            'no-unused-vars': 'off',
        },
    },
];
