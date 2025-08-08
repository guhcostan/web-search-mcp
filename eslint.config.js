// @ts-check
import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser
      }
    },
    plugins: { '@typescript-eslint': tseslint },
    rules: {
      'max-len': ['error', { code: 100, ignoreUrls: true }],
      'no-console': 'off'
    }
  }
]

