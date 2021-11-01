import type { Event, Extension, State, Tokenizer } from "micromark-util-types";
import { codes } from "micromark-util-symbol/codes";
import { types } from "micromark-util-symbol/types";
import { markdownLineEnding } from "micromark-util-character";

export interface IOptions {
  delimiter?: string | number;
}

const MINIMUM_MARKER_LENGTH = 2;

const KEYBOARD_TYPE = "keyboardSequence";
const KEYBOARD_TEXT_TYPE = types.codeTextData; // TODO check whether this is okay
const KEYBOARD_TEXT_ESCAPE_TYPE = "keyboardSequenceEscape";
const KEYBOARD_MARKER_TYPE = "keyboardSequenceMarker";

const SPACE_TYPE = "space";

/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call */
export const html = {
  enter: {
    [KEYBOARD_TYPE]: function (): void {
      this.tag("<kbd>");
    },
  },
  exit: {
    [KEYBOARD_TYPE]: function (): void {
      this.tag("</kbd>");
    },
  },
};
/* eslint-enable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call */

// adapted from <https://github.com/micromark/micromark/blob/1b378e72675b15caff021f957a824d1f01420774/packages/micromark-core-commonmark/dev/lib/code-text.js>
export const syntax = (options: IOptions = {}): Extension => {
  const delimiter = normalizeDelimiter(options.delimiter);

  const tokenizeKeyboard: Tokenizer = function (effects, ok, nok): State {
    let size = 0;

    return start;

    function start(): void | State {
      effects.enter(KEYBOARD_TYPE);
      effects.enter(KEYBOARD_MARKER_TYPE);
      return opening;
    }

    function opening(code: number): void | State {
      if (code !== delimiter && size < MINIMUM_MARKER_LENGTH) {
        return nok(code);
      }

      if (code === delimiter) {
        effects.consume(code);
        size++;
        return opening;
      }

      effects.exit(KEYBOARD_MARKER_TYPE);
      return gap;
    }

    function gap(code: number): void | State {
      if (code === codes.eof) {
        return nok(code);
      }

      if (code === delimiter) {
        // first try closing, then try parsing nested sequence, then
        // just treat it as a literal
        return effects.attempt(
          {
            tokenize: makeClosingTokenizer(delimiter, size),
            partial: true,
          },
          ok,
          () => {
            return effects.attempt(
              {
                tokenize: tokenizeKeyboard,
                partial: true,
              },
              gap,
              (code) => {
                consumeLiteral(code);
                return gap;
              },
            );
          },
        );
      }

      if (code === codes.space) {
        effects.enter(SPACE_TYPE);
        effects.consume(code);
        effects.exit(SPACE_TYPE);
        return gap;
      }

      if (markdownLineEnding(code)) {
        effects.enter(types.lineEnding);
        effects.consume(code);
        effects.exit(types.lineEnding);
        return gap;
      }

      effects.enter(KEYBOARD_TEXT_TYPE);
      return data(code);
    }

    function data(code: number): void | State {
      if (
        code === codes.eof ||
        code === codes.space ||
        code === delimiter ||
        markdownLineEnding(code)
      ) {
        effects.exit(KEYBOARD_TEXT_TYPE);
        return gap(code);
      }

      if (code === codes.backslash) {
        effects.exit(KEYBOARD_TEXT_TYPE);
        effects.consume(code);
        effects.enter(KEYBOARD_TEXT_TYPE);
        return (code) => {
          consumeLiteral(code);
          return data;
        };
      }

      effects.consume(code);
      return data;
    }

    function consumeLiteral(code: number): void | State {
      effects.enter(KEYBOARD_TEXT_ESCAPE_TYPE);
      effects.consume(code);
      effects.exit(KEYBOARD_TEXT_ESCAPE_TYPE);
    }
  };

  const tokenizer = {
    tokenize: tokenizeKeyboard,
    resolveAll: (events: Event[]) => events,
  };

  return {
    text: { [delimiter]: tokenizer },
    insideSpan: { null: [tokenizer] },
    attentionMarkers: { null: [delimiter] },
  };
};

function makeClosingTokenizer(delimiter: number, size: number): Tokenizer {
  return function (effects, ok, nok) {
    let current = 0;

    function start(): void | State {
      effects.enter(KEYBOARD_MARKER_TYPE);
      return closing;
    }

    function closing(code: number): void | State {
      if (code === delimiter) {
        effects.consume(code);
        current++;

        if (current === size) {
          effects.exit(KEYBOARD_MARKER_TYPE);
          effects.exit(KEYBOARD_TYPE);
          return ok(code);
        } else {
          return closing;
        }
      }

      return nok(code);
    }

    return start;
  };
}

export function normalizeDelimiter(
  delimiter: string | number | undefined,
): number {
  return typeof delimiter === "string"
    ? delimiter.charCodeAt(0)
    : delimiter || codes.verticalBar;
}
