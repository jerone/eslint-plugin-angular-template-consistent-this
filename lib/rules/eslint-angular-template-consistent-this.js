"use strict";

const { getTemplateParserServices } = require("../get-parser-service");

const MESSAGE_IDS = {
  properties: {
    explicit: "explicitThisProperties",
    implicit: "implicitThisProperties",
  },
  variables: {
    explicit: "explicitThisVariables",
    implicit: "implicitThisVariables",
  },
  templateReferences: {
    explicit: "explicitThisTemplateReferences",
    implicit: "implicitThisTemplateReferences",
  },
};

const RULE_NAME = "eslint-angular-template-consistent-this";

/**
 * Structural directives that are known to contain template *reference* variables.
 * See https://angular.io/guide/built-in-directives#built-in-structural-directives
 */
const SAFE_STRUCTURAL_DIRECTIVES = [
  "ngIfThen", // Then case in NgIf directive.
  "ngIfElse", // Else case in NgIf directive.
  "ngTemplateOutlet", // Template.
];

module.exports = {
  MESSAGE_IDS,
  RULE_NAME,

  meta: {
    type: "layout",
    docs: {
      description: "ESLint Angular Template consistent this for properties, variables & template references.",
      category: "Stylistic Issues",
      recommended: false,
      // TODO: url: "",
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          properties: {
            type: "string",
            enum: ["explicit", "implicit"],
            default: "explicit",
          },
          variables: {
            type: "string",
            enum: ["explicit", "implicit"],
            default: "implicit",
          },
          templateReferences: {
            type: "string",
            enum: ["explicit", "implicit"],
            default: "implicit",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      [MESSAGE_IDS.properties.explicit]:
        "Use explicit this for property `{{prop}}`.",
      [MESSAGE_IDS.properties.implicit]:
        "Don't use explicit this for property `{{prop}}`.",
      [MESSAGE_IDS.variables.explicit]:
        "Use explicit this for variable `{{prop}}`.",
      [MESSAGE_IDS.variables.implicit]:
        "Don't use explicit this for variable `{{prop}}`.",
      [MESSAGE_IDS.templateReferences.explicit]:
        "Use explicit this for template references `{{prop}}`.",
      [MESSAGE_IDS.templateReferences.implicit]:
        "Don't use explicit this for template references `{{prop}}`.",
    },
  },

  create(context) {
    const parserServices = getTemplateParserServices(context);
    const sourceCode = context.getSourceCode();
    let options = {
      properties: "explicit",
      variables: "implicit",
      templateReferences: "implicit",
      ...context.options[0],
    };

    var variables = [];
    var templates = [];

    /**
     * Report explicit of implicit error to ESLint.
     * @param {boolean} explicit True for explicit error, false for implicit error.
     * @param {string} messageId Message identifier.
     * @param {string} nodeName Node name.
     * @param {object} loc Start and end of faulty code.
     * @param {number} startIndex Index where to insert or replace "this.".
     */
    const reportError = function (
      explicit,
      messageId,
      nodeName,
      loc,
      startIndex
    ) {
      context.report({
        messageId,
        data: { prop: nodeName },
        loc,
        fix: (fixer) => {
          if (explicit) {
            return fixer.insertTextBeforeRange(
              [startIndex, startIndex],
              "this."
            );
          } else {
            return fixer.replaceTextRange(
              [startIndex, startIndex + "this.".length],
              ""
            );
          }
        },
      });
    };

    return parserServices.defineTemplateBodyVisitor({
      /**
       * This visitor contains the scoped variables and global templates references.
       * Variables should always be defined *before* property reading.
       * But template references can be defined *after* where they are being read.
       * See: https://angular.io/guide/structural-directives#template-input-variable
       * @param {*} node
       */
      Template(node) {
        variables.push(...node.variables);
        templates.push(...node.references);
      },

      PropertyRead(node) {
        const notExplicitReceiver = node.receiver.type !== "ThisReceiver";
        const notImplicitReceiver = node.receiver.type !== "ImplicitReceiver";

        // We're looking for `ThisReceiver` and `ImplicitReceiver`.
        // Everything else we're going to ignore.
        if (notExplicitReceiver && notImplicitReceiver) {
          return;
        }

        const loc = {
          start: sourceCode.getLocFromIndex(node.sourceSpan.start),
          end: sourceCode.getLocFromIndex(node.sourceSpan.end),
        };
        const startIndex = sourceCode.getIndexFromLoc(loc.start);

        // 1) Template *input* variable (`let foo;`).
        // Variables are defined before they are used.
        if (variables.map((x) => x.name).includes(node.name)) {
          if (options.variables === "explicit" && notExplicitReceiver) {
            return reportError(
              true,
              MESSAGE_IDS.variables.explicit,
              node.name,
              loc,
              startIndex
            );
          } else if (options.variables === "implicit" && notImplicitReceiver) {
            return reportError(
              false,
              MESSAGE_IDS.variables.implicit,
              node.name,
              loc,
              startIndex
            );
          }

          return;
        }

        // 2) Template *reference* variable (`#template`).
        // This will only catch templates that are defined *before* property reading.
        if (templates.map((x) => x.name).includes(node.name)) {
          if (
            options.templateReferences === "explicit" &&
            notExplicitReceiver
          ) {
            return reportError(
              true,
              MESSAGE_IDS.templateReferences.explicit,
              node.name,
              loc,
              startIndex
            );
          } else if (
            options.templateReferences === "implicit" &&
            notImplicitReceiver
          ) {
            return reportError(
              false,
              MESSAGE_IDS.templateReferences.implicit,
              node.name,
              loc,
              startIndex
            );
          }

          return;
        }

        // 3) Check if property is part of an safe structural directives.
        // This happens for templates that haven't been caught by check 2.
        // TODO: Template reference variables can also be referenced from TS. See https://angular.io/api/common/NgIf#using-an-external-then-template
        if (SAFE_STRUCTURAL_DIRECTIVES.includes(node.parent.parent.name)) {
          if (
            options.templateReferences === "explicit" &&
            notExplicitReceiver
          ) {
            return reportError(
              true,
              MESSAGE_IDS.templateReferences.explicit,
              node.name,
              loc,
              startIndex
            );
          } else if (
            options.templateReferences === "implicit" &&
            notImplicitReceiver
          ) {
            return reportError(
              false,
              MESSAGE_IDS.templateReferences.implicit,
              node.name,
              loc,
              startIndex
            );
          }

          return;
        }

        // 4) Interpolation of databinding property.
        if (options.properties === "explicit" && notExplicitReceiver) {
          return reportError(
            true,
            MESSAGE_IDS.properties.explicit,
            node.name,
            loc,
            startIndex
          );
        } else if (options.properties === "implicit" && notImplicitReceiver) {
          return reportError(
            false,
            MESSAGE_IDS.properties.implicit,
            node.name,
            loc,
            startIndex
          );
        }
      },
    });
  },
};
