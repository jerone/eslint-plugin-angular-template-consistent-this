import { RuleTester } from "../../rule-tester";
import { RULE_NAME } from "../../../src/lib/rules/eslint-plugin-angular-template-consistent-this";
import { rules } from "../../../src/index";
import { valid } from "./valid";
import { invalid } from "./invalid";

// eslint-disable-next-line security/detect-object-injection
const rule = rules[RULE_NAME];

const ruleTester = new RuleTester({
  parser: "@angular-eslint/template-parser",
});

ruleTester.run(RULE_NAME, rule, {
  valid,
  invalid,
});
