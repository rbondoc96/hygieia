// @ts-check

const {builtinModules} = require('node:module');
const {defineConfig} = require('eslint-define-config');

module.exports = defineConfig({
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:n/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:regexp/recommended',
        'plugin:prettier/recommended',
    ],
    plugins: ['@typescript-eslint', 'import', 'regexp', 'simple-import-sort'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2021,
    },
    rules: {
        'array-bracket-spacing': ['error', 'never'],
        'comma-dangle': ['error', 'always-multiline'],
        'eqeqeq': ['warn', 'always'],
        'indent': ['error', 4, {SwitchCase: 1}],
        'object-curly-newline': ['error', {consistent: true}],
        'object-curly-spacing': ['error', 'never'],
        'max-len': ['error', 100],
        'no-debugger': 'error',
        'no-empty': 'warn',
        'no-process-exit': 'off',
        'no-useless-escape': 'off',
        'prefer-const': [
            'error',
            {
                destructuring: 'all',
            },
        ],
        'quotes': ['error', 'single', {avoidEscape: true}],
        'semi': 'error',
        'sort-imports': 'off',

        'n/no-process-exit': 'off',
        'n/no-missing-import': 'off',
        'n/no-missing-require': 'error',
        'n/no-extraneous-import': [
            'error',
            {
                allowModules: ['unbuild'],
            },
        ],
        'n/no-extraneous-require': 'error',
        'n/no-deprecated-api': 'error',
        'n/no-unpublished-import': 'error',
        'n/no-unpublished-require': 'error',
        'n/no-unsupported-features/es-syntax': 'off',

        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'import/no-nodejs-modules': [
            'error',
            {
                allow: builtinModules.map(mod => `node:${mod}`),
            },
        ],
        'import/order': 'off',
        'simple-import-sort/exports': 'error',
        'simple-import-sort/imports': 'error',

        'regexp/strict': 'off',
        'regexp/no-contradiction-with-assertion': 'error',

        '@typescript-eslint/ban-ts-comment': 'error',
        '@typescript-eslint/explicit-module-boundary-types': [
            'error',
            {allowArgumentsExplicitlyTypedAsAny: true},
        ],
        '@typescript-eslint/no-empty-function': ['error', {allow: ['arrowFunctions']}],
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-extra-semi': 'off', // conflicts with prettier
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/consistent-type-imports': ['error', {prefer: 'type-imports'}],
    },
    overrides: [
        {
            files: ['packages/**'],
            excludedFiles: '**/__tests__/**',
            rules: {
                'no-restricted-globals': ['error', 'require', '__dirname', '__filename'],
            },
        },
        {
            files: ['*.spec.ts'],
            rules: {
                'n/no-extraneous-import': 'off',
            },
        },
        {
            files: ['**/build.config.ts'],
            rules: {
                'no-undef': 'off',
                'n/no-missing-import': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off',
            },
        },
        {
            files: ['*.js', '*.mjs', '*.cjs'],
            rules: {
                '@typescript-eslint/explicit-module-boundary-types': 'off',
            },
        },
        {
            files: ['*.d.ts'],
            rules: {
                '@typescript-eslint/triple-slash-reference': 'off',
            },
        },
    ],
    reportUnusedDisableDirectives: true,
});