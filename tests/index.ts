import "mocha";
import { assert } from "chai";

import { keyboard, html } from "../src/index.js";

import { micromark } from "micromark";

describe("Transformation", () => {
  describe("works for simple cases", () => {
    const cases: readonly [string, string | undefined, string][] = [
      ["||Ctrl||", undefined, "<p><kbd>Ctrl</kbd></p>"],
      ["||Ctrl||", "|", "<p><kbd>Ctrl</kbd></p>"],
      ["|| Ctrl ||", "|", "<p><kbd>Ctrl</kbd></p>"],
      ["++Ctrl++", "|", "<p>++Ctrl++</p>"],
      ["++Ctrl++", "+", "<p><kbd>Ctrl</kbd></p>"],
      ["||\\|||", undefined, "<p><kbd>|</kbd></p>"],
      ["|| \\| ||", undefined, "<p><kbd>|</kbd></p>"],
      [
        "||| ||x|| + ||Alt|| + ||hello|| |||",
        undefined,
        "<p><kbd><kbd>x</kbd>+<kbd>Alt</kbd>+<kbd>hello</kbd></kbd></p>",
      ],
      ["||a|| bc ||d", undefined, "<p><kbd>a</kbd> bc ||d</p>"], // remove orphans
    ];

    for (const [input, delimiter, expected] of cases) {
      it(`works for ${JSON.stringify(input)} with delimiter ${JSON.stringify(
        delimiter,
      )}`, () => {
        assert.equal(
          micromark(input, {
            extensions: [keyboard({ delimiter })],
            htmlExtensions: [html],
          }),
          expected,
        );
      });
    }
  });
});
