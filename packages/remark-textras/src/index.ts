import type { Root, Parent } from "hast";
import { visit } from "unist-util-visit";
import { getFirstAndLastText, addClass } from "./ast";
// This is required to augment the AST type, but unfortunately can’t
// be imported using `import type`.
// import "mdast-util-to-hast";

export const OPENING_QUOTE = /^(?:‘|“|’|”)/;
export const CLOSING_QUOTE = /(?:‘|“|’|”)$/;

export function textrasPlugin() {
  return transformer;

  function ordinalVisitor(node: Parent) {
    node.data = {
      ...node.data,
      hName: "sup",
      hProperties: { class: "ordinal" },
    };
  }

  function quoteVisitor(node: Parent) {
    const data = (node.data = {
      ...node.data,
      hName: "q",
    });

    if (node.children.length < 1) {
      return;
    }

    const [first, last] = getFirstAndLastText(node);

    const hProperties = ((data as any).hProperties =
      (data as any).hProperties || {});
    Object.assign(hProperties, (node as any).attributes);

    if (OPENING_QUOTE.test(first || "")) {
      addClass(hProperties, "pad-opening");
    }

    if (CLOSING_QUOTE.test(last || "")) {
      addClass(hProperties, "pad-closing");
    }
  }

  function transformer(tree: Root, _file: unknown) {
    visit(tree, { type: "textDirective", name: "ordinal" }, ordinalVisitor);
    visit(tree, { type: "textDirective", name: "quote" }, quoteVisitor);

    for (const [name, element] of Object.entries({
      var: "var",
      abbr: "abbr",
      samp: "samp",
    })) {
      visit(tree, { type: "textDirective", name }, (node) =>
        changeName(node, element),
      );
    }
  }
}

function changeName(
  // There is a problem with the types here because they ought to be
  // augmented by mdast-util-to-hast but… aren’t.
  node: any,
  name: string,
  extraClasses?: readonly string[],
  extraAttributes: Record<string, string> = {},
): typeof node {
  const data = node.data || (node.data = {});
  data.hName = name;
  Object.assign(node.attributes, extraAttributes);
  data.hProperties = node.attributes;
  if (extraClasses !== undefined) {
    data.hProperties["class"] = `${
      data.hProperties["class"] || ""
    } ${extraClasses.join(" ")}`.trim();
  }
  return node;
}
