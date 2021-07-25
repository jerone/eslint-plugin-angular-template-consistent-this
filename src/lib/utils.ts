import type { PropertyRead } from "@angular/compiler";
import { ImplicitReceiver, ThisReceiver } from "@angular/compiler";

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

export default {
  isExplicitReceiver,
  isImplicitReceiver,
};
