function getTemplateParserServices(context) {
  if (
    !context.parserServices ||
    !context.parserServices.defineTemplateBodyVisitor ||
    !context.parserServices.convertNodeSourceSpanToLoc
  ) {
    /**
     * The user needs to have configured "parser" in their eslint config and set it
     * to @angular-eslint/template-parser
     */
    throw new Error(
      "You have used a rule which requires '@angular-eslint/template-parser' to be used as the 'parser' in your ESLint config."
    );
  }
  return context.parserServices;
}

module.exports = {
  getTemplateParserServices,
};
