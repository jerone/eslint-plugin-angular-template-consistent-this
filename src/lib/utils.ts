import type {
  PropertyRead,
  AST,
} from "@angular-eslint/bundled-angular-compiler";
import {
  ImplicitReceiver,
  Interpolation,
  ThisReceiver,
  ASTWithSource,
} from "@angular-eslint/bundled-angular-compiler";
import type { TSESTree } from "@typescript-eslint/utils";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import type { AstWithParent } from "./types";

/**
 * Detect if a given `node` is explicit receiver.
 * @param node A property read node.
 * @returns `true` if the `node` is an explicit receiver.
 */
function isExplicitReceiver(node: PropertyRead): boolean {
  return node.receiver instanceof ThisReceiver;
}

/**
 * Detect if a given `node` is implicit receiver.
 *
 * NOTE: currently `ThisReceiver` inherits from `ImplicitReceiver`, which might not be the case in the future.
 * https://github.com/angular/angular/blob/05d996d8039b82fd0361a921224fdbf07c4b2c91/packages/compiler/src/expression_parser/ast.ts#L88-L100
 *
 * @param node A property read node.
 * @returns `true` if the `node` is an implicit receiver.
 */
function isImplicitReceiver(node: PropertyRead): boolean {
  return (
    node.receiver instanceof ImplicitReceiver &&
    !(node.receiver instanceof ThisReceiver) // `ThisReceiver` inherits from `ImplicitReceiver`.
  );
}

/**
 * Detect if a given `node` is an interpolation.
 * @param node A node.
 * @returns `true` if the `node` is an interpolation.
 */
function isInterpolation(node: AST): boolean {
  return node instanceof Interpolation;
}

/**
 * Detect if a given `node` is an AST with source.
 * @param node A node.
 * @returns `true` if the `node` is an AST with source.
 */
function isASTWithSource(node: AST): boolean {
  return node instanceof ASTWithSource;
}

/**
 * Detect if a given `node` is a program.
 * @param node A node.
 * @returns `true` if the `node` is a program.
 */
function isProgram(node: unknown): node is TSESTree.Program {
  return (node as { type?: string }).type === AST_NODE_TYPES.Program;
}

/**
 * Get nearest node from a given `node` that matches a given `predicate`.
 * @param param0 A node with parent.
 * @param predicate A predicate to match the wanted parent.
 * @returns The nearest node that matches the `predicate`.
 */
function getNearestNodeFrom<T extends AST, Tout extends AST>(
  { parent }: AstWithParent<T | Tout>,
  predicate: (parent: AST) => boolean
): Tout | null {
  while (parent && !isProgram(parent)) {
    if (predicate(parent)) {
      return parent as Tout;
    }

    parent = parent.parent;
  }

  return null;
}

/**
 * There is a bug in data-binding parser that ignores whitespaces (and line-breaks) before the expression.
 * See #1.
 *
 * @param node A node.
 * @returns The LOC offset.
 */
function getLocOffsetFix(node: AstWithParent<PropertyRead>): number {
  // This issue only applies for data-binding.
  // But there is no data-binding type, so ignore interpolation.
  const parentInterpolation = getNearestNodeFrom<PropertyRead, Interpolation>(
    node,
    isInterpolation
  );
  if (parentInterpolation !== null) return 0;

  // We need access to the source code to calculate the offset.
  const parentWithSource = getNearestNodeFrom<PropertyRead, ASTWithSource>(
    node,
    isASTWithSource
  );
  if (parentWithSource === null || parentWithSource.source === null) return 0;

  // Get all the whitespaces (including line-breaks) before the expression.
  const result = /^[\r\n\s\t]+/gm.exec(parentWithSource.source);
  if (result !== null && result.length > 0) {
    return result[0].length;
  }

  return 0;
}

export default {
  isExplicitReceiver,
  isImplicitReceiver,
  getLocOffsetFix,
};
