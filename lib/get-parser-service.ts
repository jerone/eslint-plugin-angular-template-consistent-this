// Copied from https://github.com/angular-eslint/angular-eslint/blob/36265f35aba024c3b212be93f20bc6eeda181465/packages/eslint-plugin-template/src/utils/create-eslint-rule.ts#L18-L43

function getTemplateParserServices(context: any) {
  ensureTemplateParser(context);
  return context.parserServices;
}

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'ensureTemp... Remove this comment to see the full error message
function ensureTemplateParser(context: any) {
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

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  getTemplateParserServices,
  ensureTemplateParser
};
