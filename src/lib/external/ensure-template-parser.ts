// The method `ensureTemplateParser` is exported since ESLint Angular v14.4.0.
// Any version before that requires the fallback.
// See https://github.com/angular-eslint/angular-eslint/issues/888
// Copied from https://github.com/angular-eslint/angular-eslint/blob/025ad9df4006ccd482b85df93ef52a0d5ebfa29d/packages/utils/src/eslint-plugin-template/parser-services.ts#L28-L45
// Use `import { ensureTemplateParser } from "@angular-eslint/utils";` once ESLint Angular < v14.4.0 is dropped.

import type {
  ParseSourceSpan,
  TmplAstElement,
} from "@angular-eslint/bundled-angular-compiler";
import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

export interface TemplateParserServices {
  convertNodeSourceSpanToLoc: (
    sourceSpan: ParseSourceSpan,
  ) => TSESTree.SourceLocation;
  convertElementSourceSpanToLoc: (
    context: Readonly<TSESLint.RuleContext<string, ReadonlyArray<unknown>>>,
    node: TmplAstElement,
  ) => TSESTree.SourceLocation;
}

/**
 * Utility for rule authors to ensure that their rule is correctly being used with @angular-eslint/template-parser
 * If @angular-eslint/template-parser is not the configured parser when the function is invoked it will throw
 */
export function ensureTemplateParser(
  context: Readonly<TSESLint.RuleContext<string, ReadonlyArray<unknown>>>,
): void {
  try {
    import("@angular-eslint/utils")
      .then((utils) => {
        try {
          utils.ensureTemplateParser(context);
        } catch {
          /* istanbul ignore next -- fallback for Angular ESLint v13 */
          ensureTemplateParserFallback(context);
        }
      })
      .catch(
        /* istanbul ignore next -- fallback for Angular ESLint v13 */
        () => {
          /* istanbul ignore next -- fallback for Angular ESLint v13 */
          ensureTemplateParserFallback(context);
        },
      );
  } catch {
    /* istanbul ignore next -- fallback for Angular ESLint v13 */
    ensureTemplateParserFallback(context);
  }
}

/* istanbul ignore next -- fallback for Angular ESLint v13 */
function ensureTemplateParserFallback(
  context: Readonly<TSESLint.RuleContext<string, ReadonlyArray<unknown>>>,
): void {
  if (
    !(context.parserServices as unknown as TemplateParserServices)
      ?.convertNodeSourceSpanToLoc ||
    !(context.parserServices as unknown as TemplateParserServices)
      ?.convertElementSourceSpanToLoc
  ) {
    /**
     * The user needs to have configured "parser" in their eslint config and set it
     * to @angular-eslint/template-parser
     */
    throw new Error(
      "You have used a rule which requires '@angular-eslint/template-parser' to be used as the 'parser' in your ESLint config.",
    );
  }
}
