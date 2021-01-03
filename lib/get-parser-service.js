// Copied from https://github.com/angular-eslint/angular-eslint/blob/36265f35aba024c3b212be93f20bc6eeda181465/packages/eslint-plugin-template/src/utils/create-eslint-rule.ts#L18-L43

function getTemplateParserServices(context) {
  ensureTemplateParser(context);
  return context.parserServices;
}

function ensureTemplateParser(context) {
  if (
    !context.parserServices ||
    !context.parserServices.convertNodeSourceSpanToLoc ||
    !context.parserServices.convertElementSourceSpanToLoc
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

module.exports = {
  getTemplateParserServices,
  ensureTemplateParser
};
