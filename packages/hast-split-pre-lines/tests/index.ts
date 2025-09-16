import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { fromParse5 } from "hast-util-from-parse5";
import * as parse5 from "parse5";
import type { Element } from "hast";

import { splitLines } from "../src/index.js";

describe("splitting lines should work", () => {
  (
    [
      [
        '<pre><code><span class="foo">bar\nbaz </span>quux and things go <span class="bar">here</span>\nAnyway <b>important things</b></code></pre>',
        {
          type: "element",
          tagName: "pre",
          properties: {},
          children: [
            {
              type: "element",
              tagName: "code",
              properties: {
                "data-digits": 1,
              },
              children: [
                {
                  type: "element",
                  tagName: "span",
                  properties: {
                    className: "line",
                    "data-line": 1,
                  },
                  children: [
                    {
                      type: "element",
                      tagName: "span",
                      properties: {
                        className: "line-content",
                      },
                      children: [
                        {
                          type: "element",
                          tagName: "span",
                          properties: {
                            className: ["foo"],
                          },
                          children: [
                            {
                              type: "text",
                              value: "bar",
                            },
                          ],
                        },
                        {
                          type: "text",
                          value: "\n",
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "element",
                  tagName: "span",
                  properties: {
                    className: "line",
                    "data-line": 2,
                  },
                  children: [
                    {
                      type: "element",
                      tagName: "span",
                      properties: {
                        className: "line-content",
                      },
                      children: [
                        {
                          type: "element",
                          tagName: "span",
                          properties: {
                            className: ["foo"],
                          },
                          children: [
                            {
                              type: "text",
                              value: "baz ",
                            },
                          ],
                        },
                        {
                          type: "text",
                          value: "quux and things go ",
                        },
                        {
                          type: "element",
                          tagName: "span",
                          properties: {
                            className: ["bar"],
                          },
                          children: [
                            {
                              type: "text",
                              value: "here",
                            },
                          ],
                        },
                        {
                          type: "text",
                          value: "\n",
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "element",
                  tagName: "span",
                  properties: {
                    className: "line",
                    "data-line": 3,
                  },
                  children: [
                    {
                      type: "element",
                      tagName: "span",
                      properties: {
                        className: "line-content",
                      },
                      children: [
                        {
                          type: "text",
                          value: "Anyway ",
                        },
                        {
                          type: "element",
                          tagName: "b",
                          children: [
                            {
                              type: "text",
                              value: "important things",
                            },
                          ],
                          properties: {},
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    ] as const
  ).forEach(([input, expected], index) =>
    it(`can split lines ${index + 1}`, () => {
      const parsed = fromParse5(
        parse5.parseFragment(input).childNodes[0],
      ) as Element;
      splitLines(parsed);
      assert.deepEqual(parsed, expected);
      const parsedWithWhitespace = fromParse5(
        parse5.parseFragment(input + "\n").childNodes[0],
      ) as Element;
      splitLines(parsedWithWhitespace);
      assert.deepEqual(parsedWithWhitespace, expected);
    }),
  );
});
