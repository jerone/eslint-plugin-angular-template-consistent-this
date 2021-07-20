import type { ParseSourceSpan, TmplAstElement } from '@angular/compiler';
import type { TSESLint, TSESTree } from "@typescript-eslint/experimental-utils";
import { ESLintUtils } from '@typescript-eslint/experimental-utils';

export const createESLintRule = ESLintUtils.RuleCreator(
  // eslint-disable-next-line no-unused-vars
  (_ruleName) => `https://github.com/jerone/eslint-plugin-angular-template-consistent-this/blob/master/docs/rules/eslint-plugin-angular-template-consistent-this.md`
);

interface ParserServices {
  convertNodeSourceSpanToLoc: (
    // eslint-disable-next-line no-unused-vars
    sourceSpan: ParseSourceSpan
  ) => TSESTree.SourceLocation;
  convertElementSourceSpanToLoc: (
    // eslint-disable-next-line no-unused-vars
    context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>,
    // eslint-disable-next-line no-unused-vars
    node: TmplAstElement
  ) => TSESTree.SourceLocation;
}

export function getTemplateParserServices(
  context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>
): ParserServices {
  ensureTemplateParser(context);
  return context.parserServices as unknown as ParserServices;
}

/**
 * Utility for rule authors to ensure that their rule is correctly being used with @angular-eslint/template-parser
 * If @angular-eslint/template-parser is not the configured parser when the function is invoked it will throw
 */
export function ensureTemplateParser(
  context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>
): void {
  if (
    !(context.parserServices as unknown as ParserServices)
      ?.convertNodeSourceSpanToLoc ||
    !(context.parserServices as unknown as ParserServices)
      ?.convertElementSourceSpanToLoc
  ) {
    /**
     * The user needs to have configured "parser" in their eslint config and set it
     * to @angular-eslint/template-parser
     */
    throw new Error(
      "You have used a rule which requires '@angular-eslint/template-parser' to be used as the 'parser' in your ESLint config."
    );
  }
}
