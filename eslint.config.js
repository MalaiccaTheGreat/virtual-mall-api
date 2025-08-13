import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import js from '@eslint/js';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'vendor/**',
      'laravel-backend/**',
      'public/build/**',
      'storage/**',
      'bootstrap/cache/**',
      '**/*.config.js',
      '**/*.config.mjs',
      'temp-bundle-data.js',
      'scripts/**',
      '.eslintrc.json',
      '.prettierrc',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react: pluginReact,
    },
    languageOptions: {
      ...pluginReact.configs.recommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  eslintPluginPrettierRecommended,
];
