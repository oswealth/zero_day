import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        process: 'readonly' // Define 'process' as a global variable
      }
    },
    rules: {
      semi: ['error', 'always'],
      'eol-last': ['error', 'always'],
      'no-console': 'off',
      'no-undef': 'off'
    }
  },
  pluginJs.configs.recommended
];
