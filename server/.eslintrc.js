/** Copyright (c) 2024, Tegon, all rights reserved. **/

module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'prettier',
    'unused-imports',
    'notice',
    'import',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    curly: 'warn',
    'dot-location': 'warn',
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
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        groups: [
          'type',
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        pathGroups: [
          {
            pattern: '+(lib){/**,}',
            group: 'internal',
          },
          {
            pattern: '+(common){/**,}',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '+(middlewares){/**,}',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '+(modules){/**,}',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: '+(types){/**,}',
            group: 'internal',
            position: 'after',
          },
        ],
        alphabetize: {
          order:
            'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
          caseInsensitive: true /* ignore case. Options: [true, false] */,
        },
      },
    ],
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
    'notice/notice': [
      'error',
      {
        mustMatch: 'Copyright \\(c\\) [0-9]{0,4}, Tegon, all rights reserved.',
        template:
          '/** Copyright (c) <%= YEAR %>, Tegon, all rights reserved. **/\n\n',
      },
    ],
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
