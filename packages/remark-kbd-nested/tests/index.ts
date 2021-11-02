import "mocha";
import { assert } from "chai";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

import { IOptions, remarkKbdNested } from "../src/index.js";

describe("transforming sequences should", () => {
  const parse = (options: IOptions = {}, input: string) =>
    String(
      remark()
        .use(remarkKbdNested, options)
        .use(remarkRehype)
        .use(rehypeStringify)
        .freeze()
        .processSync(input),
    );

  it("leave other text alone", () => {
    assert.equal(parse({}, ""), "");
    assert.equal(
      parse({}, "some text **strongly** *emphasized* `code`"),
      "<p>some text <strong>strongly</strong> <em>emphasized</em> <code>code</code></p>",
    );
    assert.equal(
      parse({}, "Here is some //non// *variable* text."),
      "<p>Here is some //non// <em>variable</em> text.</p>",
    );
  });

  describe("work for", () => {
    const CASES: readonly [
      string | undefined,
      string,
      string,
      string | undefined,
    ][] = [
      [undefined, "||something||", "<p><kbd>something</kbd></p>", undefined],
      [
        "^",
        "Press ^^x^^.\n\nThen something.",
        "<p>Press <kbd>x</kbd>.</p>\n<p>Then something.</p>",
        undefined,
      ],
      [
        "=",
        "1. Press === ==Ctrl== + ==Alt== + ==x== ===.\n2. Click on **Cancel**.",
        "<ol>\n<li>Press <kbd><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>x</kbd></kbd>.</li>\n<li>Click on <strong>Cancel</strong>.</li>\n</ol>",
        undefined,
      ],
      [
        "^",
        "Press ^^^ ^^Ctrl^^ + ^^   !! x !!  ^^ ^^^.\n\nThen something.",
        "<p>Press <kbd><kbd>Ctrl</kbd> + <kbd><var>x</var></kbd></kbd>.</p>\n<p>Then something.</p>",
        "!",
      ],
    ];

    for (const [delimiter, input, output, variableDelimiter] of CASES) {
      it(`delimiter ${delimiter} and input ${JSON.stringify(input)}`, () => {
        assert.equal(parse({ delimiter, variableDelimiter }, input), output);
      });
    }
  });
});
