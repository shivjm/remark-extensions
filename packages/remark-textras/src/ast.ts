import type { Parent, RootContent, Text, Properties } from "hast";

/**
 * Returns the text contents of the first and last descendants of `node` if available. These may be
 * the same if there is only one child.
 */
export function getFirstAndLastText(
  node: Parent,
): [string | undefined, string | undefined] {
  if (!("children" in node) || node.children.length === 0) {
    return [undefined, undefined];
  }

  const first = getSelfOrDescendantAsText(node.children[0]);
  const last = getSelfOrDescendantAsText(
    node.children[node.children.length - 1],
  );

  return [first, last];
}

/**
 * Returns the text contents of `node` or its first, deepest descendant if available.
 */
export function getSelfOrDescendantAsText(
  node: RootContent,
): string | undefined {
  if (node.type === "text") {
    return (node as Text).value;
  }

  if ("children" in node && node.children.length > 0) {
    return getSelfOrDescendantAsText(node.children[0]);
  }

  return undefined;
}

/**
 * Adds `className` to `properties.class`.
 */
export function addClass(properties: Properties, className: string): void {
  properties["class"] = properties["class"]
    ? `${properties["class"]} ${className}`
    : className;
}
