/** Copyright (c) 2024, Tegon, all rights reserved. **/

module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'unused-imports', 'import'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    curly: 'warn',
    eqeqeq: 'error',
    'prettier/prettier': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'no-else-return': 'warn',
    'no-lonely-if': 'warn',
    'no-inner-declarations': 'off',
    'no-unused-vars': 'off',
    'no-useless-computed-key': 'warn',
    'no-useless-return': 'warn',
    'no-var': 'warn',
    'object-shorthand': ['warn', 'always'],
    'prefer-arrow-callback': 'warn',
    'prefer-const': 'warn',
    'prefer-destructuring': ['warn', { AssignmentExpression: { array: true } }],
    'prefer-object-spread': 'warn',
    'prefer-template': 'warn',
    'spaced-comment': ['warn', 'always', { markers: ['/'] }],
    yoda: 'warn',
    '@typescript-eslint/array-type': ['warn', { default: 'array-simple' }],
    '@typescript-eslint/ban-ts-comment': [
      'warn',
      {
        'ts-expect-error': 'allow-with-description',
      },
    ],
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/consistent-indexed-object-style': ['warn', 'record'],
    '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
    '@typescript-eslint/no-unused-vars': 'warn',
  },
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['src/@@generated/**/*.tsx', 'src/@@generated/**/*.ts'],
  overrides: [
    {
      files: ['scripts/**/*'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
