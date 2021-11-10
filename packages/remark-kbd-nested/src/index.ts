/**
 * [remark](https://github.com/remarkjs/remark) plugin to support
 * keyboard and variable sequences. See {@link
 * micromark-extension-kbd-nested} for syntax and options.
 *
 * ## Use
 *
 * ```js
 * import { unified } from "unified";
 * import remarkParse from "remark-parse";
 * import { remarkKbdNested } from "remark-kbd-nested";
 * import remarkRehype from "remark-rehype";
 * import rehypeStringify from "rehype-stringify";
 *
 * main();
 *
 * async function main() {
 *   const file = await unified()
 *     .use(remarkParse)
 *     .use(remarkKbdNested)
 *     .use(remarkRehype)
 *     .use(rehypeStringify)
 *     .process("Press ||| ||Ctrl|| + ||//key//|| ||| to trigger the action.");
 *
 *   console.log(String(file));
 * }
 * ```
 *
 * Yields:
 *
 * ```html
 * <p>Press <kbd><kbd>Ctrl</kbd></kbd> + <kbd><var>key</var></kbd></kbd> to trigger the action.</p>
 * ```
 *
 * @module
 */

import { IOptions, syntax as kbd } from "micromark-extension-kbd-nested";
import type { Plugin } from "unified";
import type { Root } from "mdast";
import type { Extension as FromMarkdownExtension } from "mdast-util-from-markdown";

/** {@link mdast-util-from-markdown} extension to convert keyboard and variable sequences into [rehype](https://github.com/rehypejs/rehype/)-compatible `kbd` and `var` elements, respectively. */
const fromMarkdown: FromMarkdownExtension = Object.freeze({
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
});

/**
 * remark plugin to convert keyboard and variable sequences into
 * [rehype](https://github.com/rehypejs/rehype/)-compatible `<kbd>`
 * and `<var>` elements respectively. See {@link
 * micromark-extension-kbd-nested} for syntax and options.
 *
 * @param options
 */
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
