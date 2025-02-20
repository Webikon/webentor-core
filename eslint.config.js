import pluginJs from '@eslint/js';
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  pluginPrettierRecommended,
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/prop-types': 0,
      'react/display-name': 0,
      'prefer-template': 1,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];
