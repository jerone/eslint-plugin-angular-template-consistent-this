// https://github.com/yannickcr/eslint-plugin-react/blob/8867490f15b7c7d892f6acf9d8be6cba008b9dfb/tests/lib/rules/jsx-newline.js

"use strict";

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const path = require("path");

const NODE_MODULES = "../../node_modules";

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  ANGULAR_ESLINT: path.join(
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
    __dirname,
    NODE_MODULES,
    "@angular-eslint/template-parser"
  ),
  TYPESCRIPT_ESLINT: path.join(
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__dirname'.
    __dirname,
    NODE_MODULES,
    "@typescript-eslint/parser"
  ),
};
