module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:prettier/recommended',
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: ['react', 'jsx-a11y'],
    rules: {
      'react/react-in-jsx-scope': 'off', // if using React 17+
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  };
  