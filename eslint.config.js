import stylistic from '@stylistic/eslint-plugin-js'
import pluginImport from 'eslint-plugin-import'
import perfectionist from 'eslint-plugin-perfectionist'
import prettierConfig from 'eslint-plugin-prettier/recommended'
import is from 'eslint-plugin-simple-import-sort'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'

export default [
    prettierConfig,
    eslintPluginUnicorn.configs['flat/recommended'],

    {
        files: ['**/*.js'],
        plugins: {
            stylistic,
            pluginImport,
            'simple-import-sort': is,
            perfectionist,
            import: pluginImport,
        },
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
        },

        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',

            'no-unused-vars': 'warn',
            'no-console': 'off',
            'unicorn/prefer-top-level-await': 'off',
        },
    },
]
