import consistentThisRule, {
  RULE_NAME as consistentThisRuleName,
} from "./lib/rules/eslint-plugin-angular-template-consistent-this";

export default {
  rules: {
    [consistentThisRuleName]: consistentThisRule,
  },
};
