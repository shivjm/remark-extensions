import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import type { Root, RootContent, Parent, ElementContent, Element } from "hast";
import type {} from "micromark-extension-directive";

import { editingPlugin, CreateDateTimeFn, Options } from "../src/index.js";

type Case = [Root, CreateDateTimeFn | undefined, Root];

const CASES: readonly Case[] = [
  [{ type: "root", children: [] }, undefined, { type: "root", children: [] }],
  [
    {
      type: "root",
      children: [
        {
          type: "textDirective",
          name: "ins",
          attributes: {},
          children: [],
        } as RootContent,
      ],
    },
    undefined,
    {
      type: "root",
      children: [
        {
          attributes: {
            class: "inline",
          },
          children: [],
          data: {
            hName: "ins",
            hProperties: {
              class: "inline",
            },
          },
          name: "ins",
          type: "textDirective",
        } as RootContent,
      ],
    },
  ],
];

describe("editing should work", () => {
  let i = 0;
  for (const [input, createDateTime, expected] of CASES) {
    i++;
    it(`editing should work ${i}`, () => {
      const options: Partial<Options> = {};
      if (createDateTime !== undefined) {
        options.createDateTime = createDateTime;
      }
      const transformer = editingPlugin(options);
      transformer(input, false);
      assert.deepEqual(input, expected);
    });
  }
});
