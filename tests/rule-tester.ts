import { RuleTester as ESLintRuleTester } from "@angular-eslint/utils";
import { TSESLint } from "@typescript-eslint/utils";
import semver from "semver";

// Property `name` in RuleTester is introduced in version 8.1.0.
// See https://github.com/eslint/eslint/pull/15179
const supportsName: boolean = semver.gte(TSESLint.ESLint.version, "8.1.0");

export class RuleTester extends ESLintRuleTester {
  run<TMessageIds extends string, TOptions extends ReadonlyArray<unknown>>(
    name: string,
    rule: TSESLint.RuleModule<TMessageIds, TOptions>,
    tests: TSESLint.RunTests<TMessageIds, TOptions>
  ): void {
    // Remove property `name` when not supported.
    if (!supportsName) {
      [...tests.valid, ...tests.invalid].forEach((testCase): void => {
        if (typeof testCase === "object") {
          // Cast to `any` is needed to allow deletion of *readonly* `name` property.
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
          delete (testCase as any).name;
        }
      });
    }

    super.run(name, rule, tests);
  }
}
