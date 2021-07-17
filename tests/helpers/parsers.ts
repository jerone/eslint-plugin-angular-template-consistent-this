// https://github.com/yannickcr/eslint-plugin-react/blob/8867490f15b7c7d892f6acf9d8be6cba008b9dfb/tests/lib/rules/jsx-newline.js

"use strict";

const path = require("path");

const NODE_MODULES = "../../node_modules";

module.exports = {
  ANGULAR_ESLINT: path.join(
    __dirname,
    NODE_MODULES,
    "@angular-eslint/template-parser"
  ),
  TYPESCRIPT_ESLINT: path.join(
    __dirname,
    NODE_MODULES,
    "@typescript-eslint/parser"
  ),
};
