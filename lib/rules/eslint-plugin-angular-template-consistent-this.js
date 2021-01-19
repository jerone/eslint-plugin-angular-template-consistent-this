"use strict";

const { ensureTemplateParser } = require("../get-parser-service");

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

const RULE_NAME = "eslint-plugin-angular-template-consistent-this";

/**
 * Structural directives that are known to contain template *reference* variables.
 * See https://angular.io/guide/built-in-directives#built-in-structural-directives
 */
const SAFE_STRUCTURAL_DIRECTIVES = [
  "ngIfThen", // Then case in NgIf directive.
  "ngIfElse", // Else case in NgIf directive.
  "ngTemplateOutlet", // Template.
];

const SAFE_GLOBALS = [
  "$event", // EventEmitter.
];

module.exports = {
  MESSAGE_IDS,
  RULE_NAME,

  meta: {
    type: "suggestion",
    docs: {
      description:
        "ESLint Angular Template consistent this for properties, variables & template references.",
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
    // const parserServices =
    ensureTemplateParser(context);

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
    const reportError = function (explicit, messageId, node) {
      // const additionalOffset = isInterpolation(node.parent.type) ? -1 : 0;
      const loc = {
        start: sourceCode.getLocFromIndex(node.sourceSpan.start),
        end: sourceCode.getLocFromIndex(node.sourceSpan.end),
      };
      const startIndex = sourceCode.getIndexFromLoc(loc.start);
      // console.log(node);
      // console.log("1 --------");
      // console.log(node.parent);
      // console.log("2 --------");
      // console.log(node.parent.parent);
      // console.log("3 --------");
      // console.log(node.parent.parent.parent);
      // console.log("4 --------");
      // console.log(node.receiver);
      // console.log("5 --------");
      // console.log(node.parent.expressions);
      // console.log("6 --------");
      // console.log(loc, startIndex);
      // console.log(
      //   sourceCode.getLocFromIndex(node.span.start),
      //   sourceCode.getLocFromIndex(node.span.end)
      // );
      // console.log(
      //   sourceCode.getLocFromIndex(node.sourceSpan.start),
      //   sourceCode.getLocFromIndex(node.sourceSpan.end)
      // );
      // console.log(
      //   sourceCode.getLocFromIndex(node.nameSpan.start),
      //   sourceCode.getLocFromIndex(node.nameSpan.end)
      // );
      // console.log(node.sourceSpan);
      // console.log(
      //   {
      //     start: {
      //       line: node.sourceSpan.start.line + 1,
      //       column: node.sourceSpan.start.col,
      //     },
      //     end: {
      //       line: node.sourceSpan.end.line + 1,
      //       column: node.sourceSpan.end.col,
      //     },
      //   }
      // );
      // console.log(isInterpolation(node.parent.type));
      // //console.log(parserServices.convertNodeSourceSpanToLoc(node.sourceSpan));

      context.report({
        messageId,
        data: { prop: node.name },
        loc,
        fix: (fixer) => {
          // Because it's not possible to precisely detect the location of the interpolation,
          // we cannot fix the error. It would just insert/replace at the wrong location.
          // See https://github.com/angular-eslint/angular-eslint/issues/292
          if (isInterpolation(node.parent.type)) {
            return;
          }

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

    return {
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

        // Some globals are safe as they are.
        if (SAFE_GLOBALS.includes(node.name)) {
          return;
        }

        // 1) Template *input* variable (`let foo;`).
        // Variables are defined before they are used.
        if (variables.map((x) => x.name).includes(node.name)) {
          if (options.variables === "explicit" && notExplicitReceiver) {
            return reportError(true, MESSAGE_IDS.variables.explicit, node);
          } else if (options.variables === "implicit" && notImplicitReceiver) {
            return reportError(false, MESSAGE_IDS.variables.implicit, node);
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
              node
            );
          } else if (
            options.templateReferences === "implicit" &&
            notImplicitReceiver
          ) {
            return reportError(
              false,
              MESSAGE_IDS.templateReferences.implicit,
              node
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
              node
            );
          } else if (
            options.templateReferences === "implicit" &&
            notImplicitReceiver
          ) {
            return reportError(
              false,
              MESSAGE_IDS.templateReferences.implicit,
              node
            );
          }

          return;
        }

        // 4) Interpolation of databinding property.
        if (options.properties === "explicit" && notExplicitReceiver) {
          return reportError(true, MESSAGE_IDS.properties.explicit, node);
        } else if (options.properties === "implicit" && notImplicitReceiver) {
          return reportError(false, MESSAGE_IDS.properties.implicit, node);
        }
      },
    };
  },
};

// See https://github.com/angular-eslint/angular-eslint/blob/c8dd14c95f881593d7b6ca9f7ba80b37b7eaf40f/packages/eslint-plugin-template/src/rules/no-negated-async.ts#L73
function isInterpolation(value) {
  return value === "Interpolation";
}
