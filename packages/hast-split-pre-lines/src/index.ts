import { toHtml } from "hast-util-to-html";
import { fromParse5 } from "hast-util-from-parse5";
import * as parse5 from "parse5";
import type { Element, ElementContent, Text } from "hast";
import type { Debugger } from "debug";

/** Configurable behaviour. */
export type Options = {
  /** The class to apply to each line’s `span`. `-content` will be appended for the contents. */
  lineClass: string;

  /** Search for an element from this list under the `pre`. */
  elementsToSplit: Readonly<Set<string>>;

  /** A logging function like the one from the debug module. */
  debug: Debugger | undefined;
};

/** A set of elements to apply splitting to by default. */
const DEFAULT_ELEMENTS_TO_SPLIT: Readonly<Set<string>> = new Set([
  "code",
  "samp",
]);
/** A default class name for lines. `-content` will be appended for the contents. */
const DEFAULT_LINE_CLASS = "line";

const DEFAULT_OPTIONS: Readonly<Options> = Object.freeze({
  lineClass: DEFAULT_LINE_CLASS,
  elementsToSplit: DEFAULT_ELEMENTS_TO_SPLIT,
  debug: undefined,
});

const NEWLINE_RE = /\n/;

/**
 * Split the contents of the first allowed element in `pre` into one
 * `span` per line (denoted source by `\n`). Each individual line is
 * wrapped using [`makeLine`], which also nests another `-content`
 * `span` inside the main `span`. The line number is stored in the
 * `data-line` attribute of the outer `span`. The containing element
 * gains a `data-digits` attribute. `options` will be shallowly merged
 * with `DEFAULT_OPTIONS`.
 */
export function splitLines(pre: Element, options: Partial<Options> = {}): void {
  const { lineClass, elementsToSplit, debug } = Object.assign(
    {},
    DEFAULT_OPTIONS,
    options,
  );
  debug?.("Pre properties: %s", pre.properties);
  const child = pre.children.find(
    (child) => "tagName" in child && elementsToSplit.has(child.tagName),
  ) as Element | undefined;

  if (child === undefined) {
    return;
  }

  const { tagName } = child;
  const rawString = toHtml(child);
  const startTagLen = rawString.indexOf(">") + 1;
  const endLen = 1 + 1 + tagName.length + 1;

  // strip starting and closing tags
  const asString = rawString.slice(startTagLen, -endLen);

  const rawLines = asString.trim().split(NEWLINE_RE);

  for (let i = 0, j = rawLines.length - 1; i < j; i++) {
    const current = rawLines[i];

    const unclosed = getUnclosedTags(current);

    const suffix = unclosed.map(([tag]) => `</${tag}>`).join("");
    rawLines[i] += suffix;

    const next = rawLines[i + 1];

    const prefix = unclosed.map(([tag, extra]) => `<${tag}${extra}>`).join("");
    rawLines[i + 1] = prefix + next;
  }

  const lines = rawLines.map((l) =>
    fromParse5(parse5.parseFragment(l)),
  ) as readonly Element[];
  // lines is the proper AST for each individual line
  child.children = lines.map((l, i) =>
    makeLine(l, i, lineClass, i + 1 !== lines.length),
  );

  const digits = Math.ceil(Math.log10(lines.length));
  child.properties["data-digits"] = digits;
}

const TAG_RE = /<(\/?)\s*(\w+)([^>]*)?>/g;

/**
 * Get a list of all tags not closed in the given HTML string.
 */
export function getUnclosedTags(line: string): readonly [string, string][] {
  let lineNumber = 0,
    match: RegExpMatchArray | null = null;

  const stack: [string, string][] = [];

  while ((match = TAG_RE.exec(line)) !== null) {
    const [, closingSlash, tag, extra] = match;
    lineNumber++;

    const isEndTag = closingSlash.length > 0;

    if (tag.length === 0) {
      throw new Error(`Empty tag on line ${lineNumber.toLocaleString()}`);
    }

    if (isEndTag) {
      const last = stack.pop();

      if (last === undefined) {
        throw new Error(
          `Closing tag with no opening tags on line ${lineNumber.toLocaleString()}`,
        );
      }

      if (tag !== last[0]) {
        throw new Error(
          `Closed ${
            last[0]
          } with ${tag} on line ${lineNumber.toLocaleString()}`,
        );
      }
    } else {
      stack.push([tag, extra]);
    }
  }

  return stack;
}

/**
 * Create a wrapper element for `line`.
 */
export function makeLine(
  line: Element,
  index: number,
  lineClass: string,
  addNewline: boolean,
): Element {
  const children: ElementContent[] =
    line.children.length > 0 ? line.children : [{ type: "text", value: "" }];

  if (addNewline) {
    const newline: Text =
      children[children.length - 1].type === "text"
        ? (children.pop() as Text)
        : { type: "text", value: "" };

    newline.value += "\n";

    children.push(newline);
  }

  // `line` is a `root` node with a single child
  return {
    type: "element",
    tagName: "span",
    properties: {
      className: lineClass,
      "data-line": index + 1,
    },
    children: [
      {
        type: "element",
        tagName: "span",
        properties: {
          className: `${lineClass}-content`,
        },
        children,
      },
    ],
  };
}
