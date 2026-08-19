import js from '@eslint/js'
import { importX } from 'eslint-plugin-import-x'
import * as nodeDependenciesPlugin from 'eslint-plugin-node-dependencies'
import packageJson from 'eslint-plugin-package-json'
import perfectionist from 'eslint-plugin-perfectionist'
import is from 'eslint-plugin-simple-import-sort'
import sonarjs from 'eslint-plugin-sonarjs'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'

export default [
    {
        ignores: ['node_modules/**', 'test-assets/**'],
    },
    eslintPluginUnicorn.configs['flat/recommended'],
    js.configs.recommended,
    ...nodeDependenciesPlugin.configs['flat/recommended'],
    sonarjs.configs.recommended,
    packageJson.configs.recommended,
    importX.flatConfigs.recommended,
    {
        files: ['package.json'],
        rules: {
            'package-json/no-redundant-files': 'off',
            'package-json/no-redundant-publishConfig': 'off',
            'package-json/require-exports': 'off',
            'package-json/require-sideEffects': 'off',
        },
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2024,
            globals: {
                Buffer: 'readonly',
                console: 'readonly',
                fetch: 'readonly',
                process: 'readonly',
                URL: 'readonly',
            },
            sourceType: 'module',
        },
        plugins: {
            perfectionist,
            'simple-import-sort': is,
        },

        rules: {
            'import-x/default': 'warn',
            'import-x/namespace': 'warn',
            'no-console': 'off',
            'no-unused-vars': 'warn',
            'perfectionist/sort-array-includes': 'warn',
            'perfectionist/sort-classes': 'warn',
            'perfectionist/sort-enums': 'warn',
            'perfectionist/sort-exports': 'warn',
            'perfectionist/sort-imports': 'off',
            'perfectionist/sort-interfaces': 'warn',
            'perfectionist/sort-jsx-props': 'warn',
            'perfectionist/sort-maps': 'warn',
            'perfectionist/sort-named-exports': 'warn',
            'perfectionist/sort-named-imports': 'warn',
            'perfectionist/sort-object-types': 'warn',
            'perfectionist/sort-objects': 'warn',
            'simple-import-sort/exports': 'warn',
            'simple-import-sort/imports': 'warn',
            'sonarjs/cognitive-complexity': 'warn',
            'sonarjs/no-nested-template-literals': 'warn',
            'sonarjs/pseudo-random': 'off',
            'sonarjs/slow-regex': 'warn',
            'unicorn/consistent-function-scoping': 'warn',
            'unicorn/filename-case': 'warn',
            'unicorn/no-array-callback-reference': 'warn',
            'unicorn/no-null': 'warn',
            'unicorn/no-process-exit': 'off',
            'unicorn/prefer-native-coercion-functions': 'off',
            'unicorn/prefer-switch': 'off',
            'unicorn/prefer-top-level-await': 'off',
            'unicorn/prevent-abbreviations': 'warn',
        },
    },
]
