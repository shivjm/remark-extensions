import type { State, Tokenizer, Resolver } from "micromark-util-types";

import { codes } from "micromark-util-symbol/codes";
import { types } from "micromark-util-symbol/types";
import { markdownLineEnding } from "micromark-util-character";

interface IOptions {
  delimiter?: string | number;
}

const DEFAULT_CHARACTER = "|";
const DEFAULT_CHARACTER_CODE = DEFAULT_CHARACTER.charCodeAt(0);
const BACKSLASH_CODE = "\\".charCodeAt(0);
const REQUIRED_MARKERS = 2;

const KEYBOARD_TYPE = "keyboardSequence";
const KEYBOARD_TEXT_TYPE = types.codeTextData; // TODO check whether this is okay
const KEYBOARD_TEXT_ESCAPE = "keyboardSequenceEscape";
const KEYBOARD_SEQUENCE_MARKER = "keyboardSequenceMarker";
const SPACE_TYPE = "space";

export const html = {
  enter: {
    [KEYBOARD_TYPE]: function () {
      this.tag("<kbd>");
    },
  },
  exit: {
    [KEYBOARD_TYPE]: function () {
      this.tag("</kbd>");
    },
  },
};

// adapted from <https://github.com/micromark/micromark/blob/1b378e72675b15caff021f957a824d1f01420774/packages/micromark-core-commonmark/dev/lib/code-text.js>
export const keyboard = (options: IOptions = {}) => {
  const { delimiter: rawDelimiter } = options;
  const delimiter =
    typeof rawDelimiter === "string"
      ? rawDelimiter.charCodeAt(0)
      : rawDelimiter || DEFAULT_CHARACTER_CODE;

  const tokenizeKeyboard: Tokenizer = function (effects, ok, nok): State {
    let size = 0;

    return start;

    function start(_code: number): void | State {
      effects.enter(KEYBOARD_TYPE);
      effects.enter(KEYBOARD_SEQUENCE_MARKER);
      return opening;
    }

    function opening(code: number): void | State {
      if (code !== delimiter && size < REQUIRED_MARKERS) {
        return nok(code);
      }

      if (code === delimiter) {
        effects.consume(code);
        size++;
        return opening;
      }

      effects.exit(KEYBOARD_SEQUENCE_MARKER);
      return gap;
    }

    function gap(code: number): void | State {
      if (code === codes.eof) {
        return nok(code);
      }

      if (code === delimiter) {
        return effects.attempt(
          {
            tokenize: makeClosingTokenizer(delimiter, size),
            partial: true,
          },
          ok,
          (code) => {
            return effects.attempt(
              { tokenize: tokenizeKeyboard, partial: true },
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

      if (code === BACKSLASH_CODE) {
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
      effects.enter(KEYBOARD_TEXT_ESCAPE);
      effects.consume(code);
      effects.exit(KEYBOARD_TEXT_ESCAPE);
    }
  };

  const tokenizer = {
    tokenize: tokenizeKeyboard,
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

    function start(_code: number): void | State {
      effects.enter(KEYBOARD_SEQUENCE_MARKER);
      return closing;
    }

    function closing(code: number): void | State {
      if (code === delimiter) {
        effects.consume(code);
        current++;

        if (current === size) {
          effects.exit(KEYBOARD_SEQUENCE_MARKER);
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
