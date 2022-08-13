import type {
  AST,
  TmplAstNode,
} from "@angular-eslint/bundled-angular-compiler";
import {
  Binary,
  ImplicitReceiver,
  ThisReceiver,
  PropertyRead,
  ASTWithSource,
  TmplAstBoundAttribute,
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
 * Detect if a given `node` is an AST with source.
 * @param node A node.
 * @returns `true` if the `node` is an AST with source.
 */
function isASTWithSource(node: AST | TmplAstNode): boolean {
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
function getNearestNodeFrom<
  T extends AST | TmplAstNode,
  Tout extends AST | TmplAstNode
>(
  { parent }: AstWithParent<T | Tout>,
  predicate: (parent: AST | TmplAstNode) => boolean
): AstWithParent<Tout> | null {
  while (parent && !isProgram(parent)) {
    if (predicate(parent)) {
      return parent as AstWithParent<Tout>;
    }

    parent = parent.parent;
  }

  return null;
}

/**
 * Check if all parents of a given `node` are PropertyRead until the source.
 * @param node A node with parent.
 * @returns `true` if all parents are PropertyRead.
 */
function allParentsArePropertiesUntilSource<T extends AST>(
  node: AstWithParent<T>
): boolean {
  let isAllPropertyRead = false;
  while (node.parent && !isASTWithSource(node.parent)) {
    if (!(node.parent instanceof PropertyRead)) {
      return false;
    }
    isAllPropertyRead = true;
    node = node.parent;
  }
  return isAllPropertyRead;
}

/**
 * There is a bug in AST parser that returns the wrong locations for data-binding.
 * See #1.
 *
 * @param node A node.
 * @returns The LOC offset.
 */
function getLocOffsetFix<T extends AST>(node: AstWithParent<T>): number {
  // This issue only applies for data-binding. Ignore interpolation.
  const astBoundAttribute = getNearestNodeFrom<T, TmplAstBoundAttribute>(
    node,
    (n) => n instanceof TmplAstBoundAttribute
  );
  if (astBoundAttribute === null) {
    return 0;
  }

  // We need access to the source code to calculate the offset.
  const astWithSource = getNearestNodeFrom<T, ASTWithSource>(
    node,
    isASTWithSource
  );
  /* istanbul ignore if -- Safe-guard, out-of-scope of our own tests. */
  if (astWithSource === null || !astWithSource.source) {
    return 0;
  }

  // When child of ASTWithSource is Binary, use that span.
  if (astWithSource.ast instanceof Binary) {
    return astWithSource.ast.span.start;
  }

  // When all children tree of ASTWithSource are PropertyRead, use that span.
  if (
    node instanceof PropertyRead &&
    allParentsArePropertiesUntilSource(node)
  ) {
    return node.span.start;
  }

  // Get all the whitespaces (including line-breaks) before the expression.
  const result = /^[\r\n\s\t]+/gm.exec(astWithSource.source);
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
