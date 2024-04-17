import type { TSESLint } from "@typescript-eslint/utils";

// See explanation in `./src/lib/external/ensure-template-parser.ts` why this typing is needed.
declare module "@angular-eslint/utils" {
  export function ensureTemplateParser(
    context: Readonly<TSESLint.RuleContext<string, ReadonlyArray<unknown>>>,
  ): void;
}
