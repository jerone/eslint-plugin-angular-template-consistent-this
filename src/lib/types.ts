import type {
  AST,
  TmplAstNode,
  BindingType,
} from "@angular-eslint/bundled-angular-compiler";
import type { AST_NODE_TYPES } from "@typescript-eslint/utils";

/**
 * The groups of nodes processed by this rule.
 */
type RuleOptionGroup = "properties" | "variables" | "templateReferences";

/**
 * Possible options for this rule.
 */
type RuleOptionValue = "implicit" | "explicit";

/**
 * Options for this rule.
 */
export type RuleOptions = Array<{ [_ in RuleOptionGroup]: RuleOptionValue }>;

/**
 * The identifiers of the messages that are reported when this rule is activated.
 */
export type MessageIds =
  | "explicitThisProperties"
  | "implicitThisProperties"
  | "explicitThisVariables"
  | "implicitThisVariables"
  | "explicitThisTemplateReferences"
  | "implicitThisTemplateReferences";

/**
 * Type for list of message identifiers.
 */
export type MessageIdKeys = {
  [_ in RuleOptionGroup]: { [_ in RuleOptionValue]: MessageIds };
};

/**
 * AST with parent node type.
 */
export type AstWithParent<T extends AST | TmplAstNode> = T & {
  parent?: AstWithParent<T>;
  type: AST_NODE_TYPES | BindingType;
};
