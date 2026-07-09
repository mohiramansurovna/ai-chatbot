import globals from 'globals';
import tseslint from 'typescript-eslint';

const compactSpacingRules = {
  'array-bracket-spacing': ['warn', 'never'],
  'arrow-spacing': ['warn', { before: false, after: false }],
  'block-spacing': ['warn', 'never'],
  'comma-spacing': ['warn', { before: false, after: true }],
  'computed-property-spacing': ['warn', 'never'],
  'func-call-spacing': ['warn', 'never'],
  'generator-star-spacing': ['warn', { before: false, after: false }],
  'key-spacing': ['warn', { beforeColon: false, afterColon: false }],
  'object-curly-spacing': ['warn', 'never'],
  'rest-spread-spacing': ['warn', 'never'],
  'semi-spacing': ['warn', { before: false, after: false }],
  'space-before-blocks': ['warn', 'never'],
  'space-before-function-paren': ['warn', 'never'],
  'space-in-parens': ['warn', 'never'],
  'space-infix-ops': 'warn',
  'template-curly-spacing': ['warn', 'never'],
  'yield-star-spacing': ['warn', { before: false, after: false }],
};

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: compactSpacingRules,
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: compactSpacingRules,
  },
];
