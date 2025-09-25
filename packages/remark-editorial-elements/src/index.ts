import type { Root, Parent, Node, ElementContent } from "hast";
import { visit } from "unist-util-visit";
import type { Directive } from "micromark-extension-directive";
// This is required to augment the AST type, but unfortunately can’t
// be imported using `import type`.
// import "mdast-util-to-hast";

export type Options = {
  createDateTime?: CreateDateTimeFn;
};

export type CreateDateTimeFn = (datetime: string) => ElementContent;

export function editingPlugin(options: Partial<Options>) {
  const { createDateTime } = options;
  return transformer;

  function transformer(tree: Root, _file: unknown) {
    visit(
      tree,
      { type: "containerDirective", name: "del" },
      (node: Node & Directive) => changeName(node, "del", ["block"]),
    );
    visit(
      tree,
      { type: "containerDirective", name: "ins" },
      (node: Parent & Directive) => {
        changeName(node, "ins", ["block"]);

        if (
          node.attributes?.datetime !== undefined &&
          createDateTime !== undefined
        ) {
          node.children.unshift(createDateTime(node.attributes.datetime));
        }
      },
    );
    visit(
      tree,
      { type: "textDirective", name: "del" },
      (node: Parent & Directive) => {
        changeName(node, "del", ["inline"]);
      },
    );
    visit(tree, { type: "textDirective", name: "ins" }, (node: Directive) => {
      changeName(node, "ins", ["inline"]);
    });
    visit(tree, { type: "textDirective", name: "sic" }, sicVisitor);
    visit(tree, { type: "textDirective", name: "ellipsis" }, ellipsisVisitor);
  }

  function ellipsisVisitor(node: Parent) {
    node.data = {
      ...node.data,
      hName: "ins",
      hProperties: { class: "editorial" },
      hChildren: [{ type: "text", value: "[…]" }],
    };
  }

  function sicVisitor(node: Parent) {
    node.data = {
      ...node.data,
      hName: "ins",
      hProperties: { class: "editorial" },
      hChildren: [
        {
          type: "element",
          tagName: "abbr",
          hName: "abbr",
          properties: {
            class: "sic",
            title: "Spelling Is Correct",
          },
          children: [{ type: "text", value: "[sic]" }],
        },
      ],
    };
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
