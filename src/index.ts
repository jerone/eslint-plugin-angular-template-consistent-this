import consistentThisRule, {
  RULE_NAME as consistentThisRuleName,
} from "./lib/rules/eslint-plugin-angular-template-consistent-this";

const rules = {
  [consistentThisRuleName]: consistentThisRule,
};

export { rules };

// TODO: SonarCloud test