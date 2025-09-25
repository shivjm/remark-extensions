import type { Root, Parent } from "hast";
import { h } from "hastscript";
import { visit } from "unist-util-visit";
import { getFirstAndLastText, addClass } from "./ast.js";
// This is required to augment the AST type, but unfortunately can’t
// be imported using `import type`.
// import "mdast-util-to-hast";

const OPENING_QUOTE = /^(?:‘|“|’|”)/;
const CLOSING_QUOTE = /(?:‘|“|’|”)$/;

const YEAR_SPACE = Object.freeze({ type: "text", value: " " });

const QUOTE_SPACE = Object.freeze({
  type: "text",
  value: "\u202F",
});

const OPENING_QUOTE_AST = Object.freeze({
  type: "text",
  value: "‘",
});

const CLOSING_QUOTE_AST = Object.freeze({
  type: "text",
  value: "’",
});

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

  function transformWorkTitle(node: Parent) {
    node.data = {
      ...node.data,
      hName: "cite",
      hProperties: { class: "work-title" },
    };

    const { year, quoted } = (node as any).attributes || {};

    if (quoted !== undefined) {
      const [first, last] = getFirstAndLastText(node);

      if (OPENING_QUOTE.test(first ?? "")) {
        node.children.unshift(QUOTE_SPACE);
      }

      node.children.unshift(OPENING_QUOTE_AST);

      if (CLOSING_QUOTE.test(last ?? "")) {
        node.children.push(QUOTE_SPACE);
      }

      node.children.push(CLOSING_QUOTE_AST);
    }

    if (year !== undefined) {
      const time = h("time");
      time.data = {
        hName: "time",
        hProperties: {
          class: "work-vintage",
          datetime: year,
        },
      };

      time.children = [
        {
          type: "text",
          value: `(${year})`,
        },
      ];
      node.children.push(YEAR_SPACE);
      node.children.push(time);
    }
  }

  function transformer(tree: Root, _file: unknown) {
    visit(tree, { type: "textDirective", name: "ordinal" }, ordinalVisitor);
    visit(tree, { type: "textDirective", name: "quote" }, quoteVisitor);
    visit(tree, { type: "textDirective", name: "work" }, transformWorkTitle);

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
