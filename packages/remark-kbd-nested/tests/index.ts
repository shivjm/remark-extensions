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
      "",
    );
  });

  describe("work for", () => {
    const CASES: readonly [string | undefined, string, string][] = [
      [undefined, "||something||", "<p><kbd>something</kbd></p>"],
      [
        "^",
        "Press ^^x^^.\n\nThen something.",
        "<p>Press <kbd>x</kbd>.</p>\n<p>Then something.</p>",
      ],
      [
        "=",
        "1. Press === ==Ctrl== + ==Alt== + ==x== ===.\n2. Click on **Cancel**.",
        "<ol>\n<li>Press <kbd><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>x</kbd></kbd>.</li>\n<li>Click on <strong>Cancel</strong>.</li>\n</ol>",
      ],
    ];

    for (const [delimiter, input, output] of CASES) {
      it(`delimiter ${delimiter} and input ${JSON.stringify(input)}`, () => {
        assert.equal(parse({ delimiter }, input), output);
      });
    }
  });
});
