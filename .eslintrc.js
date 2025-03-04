module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling', 'index'],
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'react/no-unescaped-entities': 'off',
    '@next/next/no-img-element': 'off', // Only if you want to disable image optimization warnings
  },
} 