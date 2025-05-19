/* eslint-env node */

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  globals: {
    window: 'readonly',
    document: 'readonly',
    require: 'readonly',
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-native/all'
  ],
  plugins: ['react', 'react-native'],
  rules: {
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'off',
  },
  ignorePatterns: ['node_modules/']
}
