module.exports = {
  extends: 'airbnb-base',
  plugins: [
    'import',
  ],
  rules: {
    'class-methods-use-this': 'off',
    'no-cond-assign': ['error', 'except-parens'],
    'no-console': 'off',
  },
};
