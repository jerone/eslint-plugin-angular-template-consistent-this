import { createESLintRule, ensureTemplateParser } from "../get-parser-service";
import type { TSESLint, TSESTree } from "@typescript-eslint/experimental-utils";
import type { AST, PropertyRead, TmplAstElement } from "@angular/compiler";
import { ThisReceiver } from "@angular/compiler";
import { ImplicitReceiver } from "@angular/compiler";

type groups = "properties" | "variables" | "templateReferences";
type implicitExplicit = "implicit" | "explicit";
type messageIdKeys = { [_ in groups]: { [_ in implicitExplicit]: MessageIds } };
type Options = Array<{ [_ in groups]: implicitExplicit }>;
export type MessageIds =
  | "explicitThisProperties"
  | "implicitThisProperties"
  | "explicitThisVariables"
  | "implicitThisVariables"
  | "explicitThisTemplateReferences"
  | "implicitThisTemplateReferences";
type PropertyReadWithParent = PropertyRead & {
  receiver: AST;
} & {
  parent: TmplAstElement & { parent: TmplAstElement };
};

export const MESSAGE_IDS: messageIdKeys = {
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

export const RULE_NAME = "eslint-plugin-angular-template-consistent-this";

/**
 * Structural directives that are known to contain template *reference* variables.
 * See https://angular.io/guide/built-in-directives#built-in-structural-directives
 */
const SAFE_STRUCTURAL_DIRECTIVES: Array<string> = [
  "ngIfThen", // Then case in NgIf directive.
  "ngIfElse", // Else case in NgIf directive.
  "ngTemplateOutlet", // Template.
];

const SAFE_GLOBALS = [
  "$event", // EventEmitter.
];

export default createESLintRule<Options, MessageIds>({
  name: RULE_NAME,
  defaultOptions: [
    {
      properties: "explicit",
      variables: "implicit",
      templateReferences: "implicit",
    },
  ],

  meta: {
    type: "suggestion",
    docs: {
      description:
        "ESLint Angular Template consistent this for properties, variables & template references.",
      category: "Stylistic Issues",
      recommended: false,
      //url: "https://github.com/jerone/eslint-plugin-angular-template-consistent-this/blob/master/docs/rules/eslint-plugin-angular-template-consistent-this.md",
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
      explicitThisProperties: "Use explicit this for property `{{prop}}`.",
      implicitThisProperties:
        "Don't use explicit this for property `{{prop}}`.",
      explicitThisVariables: "Use explicit this for variable `{{prop}}`.",
      implicitThisVariables: "Don't use explicit this for variable `{{prop}}`.",
      explicitThisTemplateReferences:
        "Use explicit this for template references `{{prop}}`.",
      implicitThisTemplateReferences:
        "Don't use explicit this for template references `{{prop}}`.",
    },
  },
  create(
    context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
    optionsWithDefault: Readonly<Options>
  ): TSESLint.RuleListener {
    ensureTemplateParser(context);

    const sourceCode = context.getSourceCode();
    const options = optionsWithDefault[0];

    const variables: any = [];
    const templates: any = [];

    /**
     * Report explicit of implicit error to ESLint.
     * @param {boolean} explicit True for explicit error, false for implicit error.
     * @param {string} messageId Message identifier.
     * @param {string} node Node.
     */
    const reportError = function (
      explicit: boolean,
      messageId: MessageIds,
      node: any
    ): void {
      // const additionalOffset = isInterpolation(node.parent.type) ? -1 : 0;
      const loc: Readonly<TSESTree.SourceLocation> = {
        start: sourceCode.getLocFromIndex(node.sourceSpan.start),
        end: sourceCode.getLocFromIndex(node.sourceSpan.end),
      };
      const startIndex: number = sourceCode.getIndexFromLoc(loc.start);
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
        fix: (fixer: TSESLint.RuleFixer) => {
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
      // ["*"](node) {
      //  console.log(node.name);
      //  if (/*node.name === "pagination" || */!node.name)
      //  	console.log(node);
      // },

      /**
       * This visitor contains the scoped variables and global templates references.
       * Variables should always be defined *before* property reading.
       * But template references can be defined *after* where they are being read.
       * See: https://angular.io/guide/structural-directives#template-input-variable
       * @param {*} node
       */
      Template(node: any): void {
        variables.push(...node.variables);
        templates.push(...node.references);
        // console.log(
        //   "Template",
        //   variables.map((x) => x.name),
        //   templates.map((x) => x.name),
        //   templates.map((x) => x.name).includes("pagination")
        // );
      },

      Element(node: any): void {
        // if(node.name == "clr-dg-pagination")
        // 	console.log('Element', node);

        if (node.references && node.references.length > 0) {
          templates.push(...node.references);
          // console.log(
          //   "Element",
          //   variables.map((x) => x.name),
          //   templates.map((x) => x.name),
          //   templates.map((x) => x.name).includes("pagination")
          // );
        }
      },

      // Reference(node) {
      //   console.log("Reference", node);
      // },

      PropertyRead(node: PropertyReadWithParent): void {
        // console.log(
        //   "PropertyRead",
        //   node,
        //   node.name,
        //   node.name === "pagination" ? "!!!" : "",
        //   variables.map((x: { name: any; }) => x.name),
        //   templates.map((x: { name: any; }) => x.name),
        //   templates.map((x: { name: any; }) => x.name).includes("pagination")
        // );

        // We're looking for `ThisReceiver` and `ImplicitReceiver`.
        // Everything else we're going to ignore.
        // NOTE: currently `ThisReceiver` inherits from `ImplicitReceiver`, which might not be the case in the future.
        if (
          !(node.receiver instanceof ImplicitReceiver) &&
          !(node.receiver instanceof ThisReceiver)
        ) {
          return;
        }

        const isExplicitReceiver = node.receiver instanceof ThisReceiver;
        const isImplicitReceiver =
          node.receiver instanceof ImplicitReceiver &&
          !(node.receiver instanceof ThisReceiver); // `ThisReceiver` inherits from `ImplicitReceiver`.

        // Some globals are safe as they are.
        if (SAFE_GLOBALS.includes(node.name)) {
          return;
        }

        // 1) Template *input* variable (`let foo;`).
        // Variables are defined before they are used.
        if (variables.map((x: { name: any }) => x.name).includes(node.name)) {
          if (options.variables === "explicit" && isImplicitReceiver) {
            return reportError(true, MESSAGE_IDS.variables.explicit, node);
          } else if (options.variables === "implicit" && isExplicitReceiver) {
            return reportError(false, MESSAGE_IDS.variables.implicit, node);
          }

          return;
        }

        // 2) Template *reference* variable (`#template`).
        // This will only catch templates that are defined *before* property reading.
        if (templates.map((x: any) => x.name).includes(node.name)) {
          if (options.templateReferences === "explicit" && isImplicitReceiver) {
            return reportError(
              true,
              MESSAGE_IDS.templateReferences.explicit,
              node
            );
          } else if (
            options.templateReferences === "implicit" &&
            isExplicitReceiver
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
          if (options.templateReferences === "explicit" && isImplicitReceiver) {
            return reportError(
              true,
              MESSAGE_IDS.templateReferences.explicit,
              node
            );
          } else if (
            options.templateReferences === "implicit" &&
            isExplicitReceiver
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
        if (options.properties === "explicit" && isImplicitReceiver) {
          return reportError(true, MESSAGE_IDS.properties.explicit, node);
        } else if (options.properties === "implicit" && isExplicitReceiver) {
          return reportError(false, MESSAGE_IDS.properties.implicit, node);
        }
      },
    };
  },
});
