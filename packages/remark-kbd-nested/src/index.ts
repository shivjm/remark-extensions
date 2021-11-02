import { IOptions, syntax as kbd } from "micromark-extension-kbd-nested";
import type { Plugin } from "unified";
import type { Root } from "mdast";
import type { Extension as FromMarkdownExtension } from "mdast-util-from-markdown";

const fromMarkdown: FromMarkdownExtension = {
  canContainEols: ["keyboard"],
  enter: {
    keyboardSequence: function (token) {
      this.enter(
        {
          /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any */
          type: "keyboard" as any,
          data: { hName: "kbd" },
          attributes: {},
          children: [],
        },
        token,
      );
    },
    keyboardSequenceVariable: function (token) {
      this.enter(
        {
          /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any */
          type: "variable" as any,
          data: { hName: "var" },
          attributes: {},
          children: [],
        },
        token,
      );
    },
  },
  exit: {
    keyboardSequence: function (token) {
      this.exit(token);
    },
    keyboardSequenceVariable: function (token) {
      this.exit(token);
    },
  },
};

export const remarkKbdNested: Plugin<IOptions[], Root> = function (
  options: IOptions = {},
): void {
  const data = this.data();

  add("micromarkExtensions", kbd(options));
  add("fromMarkdownExtensions", fromMarkdown);

  function add(field: string, value: unknown) {
    const list = (data[field] ? data[field] : (data[field] = [])) as unknown[];
    list.push(value);
  }
};

export { IOptions } from "micromark-extension-kbd-nested";
