/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@tegonhq/eslint-config/server.js'],
  parserOptions: {
    project: true,
  },
};
