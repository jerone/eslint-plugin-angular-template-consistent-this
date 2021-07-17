// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'rule'.
const rule = require("./lib/rules/eslint-plugin-angular-template-consistent-this.js");

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  rules: {
    "eslint-plugin-angular-template-consistent-this": rule,
  },
};
