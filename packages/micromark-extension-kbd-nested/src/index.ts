import type {
  Code,
  CompileContext,
  Effects,
  Event,
  Extension,
  State,
  Tokenizer,
} from "micromark-util-types";
import { codes } from "micromark-util-symbol/codes";
import { types } from "micromark-util-symbol/types";
import { markdownLineEndingOrSpace } from "micromark-util-character";

export interface IOptions {
  delimiter?: string | number;
}

const MINIMUM_MARKER_LENGTH = 2;

const KEYBOARD_TYPE = "keyboardSequence";
const KEYBOARD_TEXT_TYPE = types.codeTextData; // TODO check whether this is okay
const KEYBOARD_TEXT_ESCAPE_TYPE = "keyboardSequenceEscape";
const KEYBOARD_MARKER_TYPE = "keyboardSequenceMarker";

const SPACE_TYPE = "space";

export const html: Extension = {
  enter: {
    [KEYBOARD_TYPE]: function (this: CompileContext): void {
      this.tag("<kbd>");
    },
  },
  exit: {
    [KEYBOARD_TYPE]: function (this: CompileContext): void {
      this.tag("</kbd>");
    },
  },
};
/* eslint-enable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call */

// adapted from <https://github.com/micromark/micromark/blob/1b378e72675b15caff021f957a824d1f01420774/packages/micromark-core-commonmark/dev/lib/code-text.js>
export const syntax = (options: IOptions = {}): Extension => {
  const delimiter = normalizeDelimiter(options.delimiter);

  const makeTokenizer: (insideText: boolean) => Tokenizer = (insideText) =>
    function (effects, ok, nok): State {
      let size = 0;

      return start;

      function start(): void | State {
        if (insideText) {
          effects.exit(KEYBOARD_TEXT_TYPE);
        }

        effects.enter(KEYBOARD_TYPE);
        effects.enter(KEYBOARD_MARKER_TYPE);
        return opening;
      }

      function opening(code: Code): void | State {
        if (code !== delimiter && size < MINIMUM_MARKER_LENGTH) {
          return nok(code);
        }

        if (code === delimiter) {
          effects.consume(code);
          size++;
          return opening;
        }

        effects.exit(KEYBOARD_MARKER_TYPE);
        return openingGap;
      }

      function openingGap(code: Code): void | State {
        if (isEof(code)) {
          return nok;
        }

        if (tryWhitespace(code, effects)) {
          return openingGap;
        }

        return startData;
      }

      function startData(_code: Code): void | State {
        effects.enter(KEYBOARD_TEXT_TYPE);
        return data;
      }

      function data(code: Code): void | State {
        const t = makeClosingTokenizer(delimiter, size, true, insideText);

        if (isEof(code)) {
          effects.exit(KEYBOARD_TEXT_TYPE);
          effects.enter(KEYBOARD_MARKER_TYPE);
          effects.exit(KEYBOARD_MARKER_TYPE);
          return nok(code);
        }

        if (markdownLineEndingOrSpace(code) || code === delimiter) {
          return effects.attempt(
            {
              tokenize: t,
              partial: true,
            },
            ok,
            code === delimiter
              ? () =>
                  effects.attempt(
                    {
                      tokenize: makeTokenizer(true),
                      partial: true,
                    },
                    data,
                    nok,
                  )
              : literal,
          );
        }

        return literal;
      }

      function literal(code: Code): void | State {
        if (code === codes.backslash) {
          effects.exit(KEYBOARD_TEXT_TYPE);
          effects.enter(KEYBOARD_TEXT_ESCAPE_TYPE);
          effects.consume(code);
          effects.exit(KEYBOARD_TEXT_ESCAPE_TYPE);
          effects.enter(KEYBOARD_TEXT_TYPE);
          return onlyLiteral;
        }

        return onlyLiteral;
      }

      function onlyLiteral(code: Code): void | State {
        effects.consume(code);
        return data;
      }
    };

  const tokenizer = {
    tokenize: makeTokenizer(false),
    resolveAll: (events: Event[]) => events,
  };

  return {
    text: { [delimiter]: tokenizer },
    insideSpan: { null: [tokenizer] },
    attentionMarkers: { null: [delimiter] },
  };
};

function makeClosingTokenizer(
  delimiter: number,
  size: number,
  exitText: boolean,
  enterText: boolean,
): Tokenizer {
  return function (effects, ok, nok) {
    let current = 0;
    const { events } = this;

    function start(): void | State {
      if (exitText) {
        effects.exit(KEYBOARD_TEXT_TYPE);
      }

      effects.enter(SPACE_TYPE);
      return gap;
    }

    function gap(code: Code): State {
      if (tryWhitespace(code, effects)) {
        return gap;
      }

      effects.exit(SPACE_TYPE);
      effects.enter(KEYBOARD_MARKER_TYPE);
      return closing;
    }

    function closing(code: Code): void | State {
      if (code === delimiter) {
        effects.consume(code);
        current++;

        if (current === size) {
          effects.exit(KEYBOARD_MARKER_TYPE)._close = true;
          effects.exit(KEYBOARD_TYPE)._close = true;
          if (enterText) {
            effects.enter(KEYBOARD_TEXT_TYPE);
          }
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

function isEof(code: Code): boolean {
  return code === codes.eof;
}

function tryWhitespace(code: Code, effects: Effects): boolean {
  if (code === codes.space) {
    effects.enter(SPACE_TYPE);
    effects.consume(code);
    effects.exit(SPACE_TYPE);
    return true;
  }

  if (markdownLineEndingOrSpace(code)) {
    effects.enter(types.lineEnding);
    effects.consume(code);
    effects.exit(types.lineEnding);
    return true;
  }

  return false;
}
