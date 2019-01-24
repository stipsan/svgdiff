const { version } = require('react/package.json')

const rules = { 'react/react-in-jsx-scope': 'off' }

const overrides = [
  {
    files: ['*.ts', '*.tsx'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
      project: './tsconfig.json'
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error'
    }
  },
  {
    files: ['*.tsx'],
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      }
    }
  }
]

module.exports = {
  extends: 'react-app',
  settings: { react: { version } },
  rules,
  overrides
}
