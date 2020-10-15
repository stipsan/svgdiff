const { version } = require('react/package.json')

module.exports = {
  extends: 'react-app',
  settings: { react: { version } },
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
}
