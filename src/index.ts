import type { State, Tokenizer, Resolver } from "micromark-util-types";

import { resolveAll } from "micromark-util-resolve-all";
import { classifyCharacter } from "micromark-util-classify-character";
import { splice } from "micromark-util-chunked";
import * as symbol from "micromark-util-symbol/types"; // weird import issues
import * as symbol2 from "micromark-util-symbol/constants"; // weird import issues

interface IOptions {
  delimiter?: string | number;
}

const DEFAULT_CHARACTER = "|";
const DEFAULT_CHARACTER_CODE = DEFAULT_CHARACTER.charCodeAt(0);
const REQUIRED_MARKERS = 2;

export function transform(input: string): string {
  return input;
}

export const html = {
  enter: {
    kbd: enterKbdData,
  },
  exit: {
    kbd: exitKbdData,
  },
};

function enterKbdData() {
  this.tag("<kbd>");
}

function exitKbdData() {
  this.tag("</kbd>");
}

// adapted from
// <https://github.com/micromark/micromark-extension-gfm-strikethrough/blob/1dcbb1c8ac9c9cdf1154a08d8c876089aca9b096/dev/lib/syntax.js#L31>
// TODO extend this to allow configurable delimiters and nested sequences
export const keyboard = (options: IOptions = {}) => {
  const { delimiter: rawDelimiter } = options;
  const delimiter =
    typeof rawDelimiter === "string"
      ? rawDelimiter.charCodeAt(0)
      : rawDelimiter || DEFAULT_CHARACTER_CODE;

  const resolveAllKeyboard: Resolver = (events, context) => {
    let index = -1;

    // Walk through all events.
    while (++index < events.length) {
      // Find a token that can close.
      if (
        events[index][0] === "enter" &&
        events[index][1].type === "kbdSequenceTemporary" &&
        events[index][1]._close
      ) {
        let open = index;

        // Now walk back to find an opener.
        while (open--) {
          // Find a token that can open the closer.
          if (
            events[open][0] === "exit" &&
            events[open][1].type === "kbdSequenceTemporary" &&
            events[open][1]._open &&
            // If the sizes are the same:
            events[index][1].end.offset - events[index][1].start.offset ===
              events[open][1].end.offset - events[open][1].start.offset
          ) {
            events[index][1].type = "kbdSequence";
            events[open][1].type = "kbdSequence";

            const kbd = {
              type: "kbd",
              start: Object.assign({}, events[open][1].start),
              end: Object.assign({}, events[index][1].end),
            };

            const text = {
              type: "kbdText",
              start: Object.assign({}, events[open][1].end),
              end: Object.assign({}, events[index][1].start),
            };

            // Opening.
            const nextEvents = [
              ["enter", kbd, context],
              ["enter", events[open][1], context],
              ["exit", events[open][1], context],
              ["enter", text, context],
            ];

            // Between.
            splice(
              nextEvents,
              nextEvents.length,
              0,
              resolveAll(
                context.parser.constructs.insideSpan.null,
                events.slice(open + 1, index),
                context,
              ),
            );

            // Closing.
            splice(nextEvents, nextEvents.length, 0, [
              ["exit", text, context],
              ["enter", events[index][1], context],
              ["exit", events[index][1], context],
              ["exit", kbd, context],
            ]);

            splice(events, open - 1, index - open + 3, nextEvents);

            index = open + nextEvents.length - 2;
            break;
          }
        }
      }
    }

    index = -1;

    while (++index < events.length) {
      if (events[index][1].type === "kbdSequenceTemporary") {
        events[index][1].type = symbol.types.data;
      }
    }

    return events;
  };

  const tokenizeKeyboard: Tokenizer = function (effects, ok, nok): State {
    const { previous, events } = this;

    let size = 0;

    return start;

    function start(code: number): void | State {
      if (
        code !== delimiter ||
        (previous === delimiter &&
          events[events.length - 1][1].type !== symbol.types.characterEscape)
      ) {
        return nok(code);
      }

      effects.enter("kbdSequenceTemporary");
      return more(code);
    }

    function more(code: number): void | State {
      const before = classifyCharacter(previous);

      if (code === delimiter) {
        // If this is the third marker, exit.
        if (size > 1) return nok(code);
        effects.consume(code);
        size++;
        return more;
      }

      if (size < REQUIRED_MARKERS) return nok(code);
      const token = effects.exit("kbdSequenceTemporary");
      const after = classifyCharacter(code);
      token._open =
        !after ||
        (after === symbol2.constants.attentionSideAfter && Boolean(before));
      token._close =
        !before ||
        (before === symbol2.constants.attentionSideAfter && Boolean(after));
      return ok(code);
    }
  };

  const tokenizer = {
    tokenize: tokenizeKeyboard,
    resolveAll: resolveAllKeyboard,
  };

  return {
    text: { [delimiter]: tokenizer },
    insideSpan: { null: [tokenizer] },
    attentionMarkers: { null: [delimiter] },
  };
};
