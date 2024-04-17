import type { TSESLint } from "@typescript-eslint/utils";

declare module "@angular-eslint/utils" {
  export function ensureTemplateParser(
    context: Readonly<TSESLint.RuleContext<string, ReadonlyArray<unknown>>>,
  ): void;
}
