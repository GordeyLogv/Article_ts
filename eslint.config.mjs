import eslintBase from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import pluginN from 'eslint-plugin-n';
import pluginImport from 'eslint-plugin-import';
import globals from 'globals';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default tseslint.config(
    eslintBase.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    pluginN.configs['flat/recommended'],
    {
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
            },
            sourceType: 'module',
            ecmaVersion: 2020,
            globals: globals.node,
        },
        plugins: {
            import: pluginImport,
        },
        rules: {
            'n/no-unpublished-import': 'off',
            'n/no-unsupported-features/node-builtins': 'off',

            'import/order': [
                'warn',
                {
                    groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
                    alphabetize: { order: 'ignore', caseInsensitive: true },
                    'newlines-between': 'always',
                },
            ],

            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
    prettierConfig,
    {
        ignores: ['dist', 'node_modules', '*.env'],
    },
);
