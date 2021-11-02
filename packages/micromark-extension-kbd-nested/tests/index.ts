import "mocha";
import { assert } from "chai";

import { html, syntax } from "../src/index.js";

import { micromark } from "micromark";

type Cases =
  | readonly [string, string | undefined, string][]
  | readonly [string, string | undefined, string, string | undefined][];

function runCases(cases: Cases) {
  for (const [input, delimiter, expected, variableDelimiter] of cases) {
    it(`delimiter: ${JSON.stringify(delimiter)}, input: ${JSON.stringify(
      input,
    )}`, () => {
      assert.equal(
        micromark(input, {
          extensions: [syntax({ delimiter, variableDelimiter })],
          htmlExtensions: [html],
        }),
        expected,
      );
    });
  }
}

describe("works for simple cases", () => {
  runCases([
    ["||Ctrl||", undefined, "<p><kbd>Ctrl</kbd></p>"],
    ["| ||Ctrl||", undefined, "<p>| <kbd>Ctrl</kbd></p>"],
    ["| ||Ctrl|| |", undefined, "<p>| <kbd>Ctrl</kbd> |</p>"],
    ["||Ctrl||", "|", "<p><kbd>Ctrl</kbd></p>"],
    ["|| Ctrl ||", "|", "<p><kbd>Ctrl</kbd></p>"],
    ["|| npm run build ||", undefined, "<p><kbd>npm run build</kbd></p>"],
    ["||a|| bc ||d", undefined, "<p><kbd>a</kbd> bc ||d</p>"],
  ]);
});

describe("handles different delimiters", () => {
  runCases([
    ["++Ctrl++", "|", "<p>++Ctrl++</p>"],
    ["++Ctrl++", "+", "<p><kbd>Ctrl</kbd></p>"],
  ]);
});

describe("handles escaping", () => {
  runCases([
    ["||\\|||", undefined, "<p><kbd>|</kbd></p>"],
    ["|| \\| ||", undefined, "<p><kbd>|</kbd></p>"],
    ["|| \\| \\| || \\|", undefined, "<p><kbd>| |</kbd> |</p>"],
    ["|| \\  ||", undefined, "<p><kbd> </kbd></p>"],
    ["|| \\\\  ||", undefined, "<p><kbd>\\</kbd></p>"],
    ["++ \\  ++", "+", "<p><kbd> </kbd></p>"],
  ]);
});

describe("handles nesting", () => {
  runCases([
    [
      "|||  ||Ctrl||  +  ||Alt|| + ||x||  |||",
      undefined,
      "<p><kbd><kbd>Ctrl</kbd>  +  <kbd>Alt</kbd> + <kbd>x</kbd></kbd></p>",
    ],
    [
      "||||| ||Ctrl|| + |||| Alt |||| + |||x||| |||||",
      undefined,
      "<p><kbd><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>x</kbd></kbd></p>",
    ],
  ]);
});

describe("handles variable sections", () => {
  runCases([
    ["||//k//||", undefined, "<p><kbd><var>k</var></kbd></p>", undefined],
    [
      "||| ||Ctrl|| + ||// key //|| |||",
      undefined,
      "<p><kbd><kbd>Ctrl</kbd> + <kbd><var>key</var></kbd></kbd></p>",
      undefined,
    ],
    ["++||k||   ++", "+", "<p><kbd><var>k</var></kbd></p>", "|"],
    [
      "!!! !!Ctrl!! + !!   __key   __!! !!!",
      "!",
      "<p><kbd><kbd>Ctrl</kbd> + <kbd><var>key</var></kbd></kbd></p>",
      "_",
    ],
  ]);
});

describe("handles everything together", () => {
  runCases([
    [
      "@@@@@ @@Ctrl@@ + @@@@ Alt @@@@ + @@@ \\@@@@ @@@@@",
      "@",
      "<p><kbd><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>@</kbd></kbd></p>",
    ],
    [
      "@@@@@ @@Ctrl@@ + @@@@ Alt @@@@ + @@@ \\ @@@ @@@@@",
      "@",
      "<p><kbd><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd> </kbd></kbd></p>",
    ],
  ]);
});

describe("doesn’t break anything else", () => {
  runCases([
    [
      "Hello `||there||` my friends",
      undefined,
      "<p>Hello <code>||there||</code> my friends</p>",
    ],
    [
      "Hello `there` ||q|| my friends",
      undefined,
      "<p>Hello <code>there</code> <kbd>q</kbd> my friends</p>",
    ],
    [
      "Hello `there` |q my friends",
      undefined,
      "<p>Hello <code>there</code> |q my friends</p>",
    ],
    [
      "Hello `there` |q| my friends",
      undefined,
      "<p>Hello <code>there</code> |q| my friends</p>",
    ],
  ]);
});
