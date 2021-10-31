"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syntax = exports.html = void 0;
const codes_1 = require("micromark-util-symbol/codes");
const types_1 = require("micromark-util-symbol/types");
const micromark_util_character_1 = require("micromark-util-character");
const MINIMUM_MARKER_LENGTH = 2;
const KEYBOARD_TYPE = "keyboardSequence";
const KEYBOARD_TEXT_TYPE = types_1.types.codeTextData; // TODO check whether this is okay
const KEYBOARD_TEXT_ESCAPE_TYPE = "keyboardSequenceEscape";
const KEYBOARD_MARKER_TYPE = "keyboardSequenceMarker";
const SPACE_TYPE = "space";
/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call */
exports.html = {
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
/* eslint-enable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call */
// adapted from <https://github.com/micromark/micromark/blob/1b378e72675b15caff021f957a824d1f01420774/packages/micromark-core-commonmark/dev/lib/code-text.js>
const syntax = (options = {}) => {
    const { delimiter: rawDelimiter } = options;
    const delimiter = typeof rawDelimiter === "string"
        ? rawDelimiter.charCodeAt(0)
        : rawDelimiter || codes_1.codes.verticalBar;
    const tokenizeKeyboard = function (effects, ok, nok) {
        let size = 0;
        return start;
        function start() {
            effects.enter(KEYBOARD_TYPE);
            effects.enter(KEYBOARD_MARKER_TYPE);
            return opening;
        }
        function opening(code) {
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
        function gap(code) {
            if (code === codes_1.codes.eof) {
                return nok(code);
            }
            if (code === delimiter) {
                // first try closing, then try parsing nested sequence, then
                // just treat it as a literal
                return effects.attempt({
                    tokenize: makeClosingTokenizer(delimiter, size),
                    partial: true,
                }, ok, () => {
                    return effects.attempt({ tokenize: tokenizeKeyboard, partial: true }, gap, (code) => {
                        consumeLiteral(code);
                        return gap;
                    });
                });
            }
            if (code === codes_1.codes.space) {
                effects.enter(SPACE_TYPE);
                effects.consume(code);
                effects.exit(SPACE_TYPE);
                return gap;
            }
            if ((0, micromark_util_character_1.markdownLineEnding)(code)) {
                effects.enter(types_1.types.lineEnding);
                effects.consume(code);
                effects.exit(types_1.types.lineEnding);
                return gap;
            }
            effects.enter(KEYBOARD_TEXT_TYPE);
            return data(code);
        }
        function data(code) {
            if (code === codes_1.codes.eof ||
                code === codes_1.codes.space ||
                code === delimiter ||
                (0, micromark_util_character_1.markdownLineEnding)(code)) {
                effects.exit(KEYBOARD_TEXT_TYPE);
                return gap(code);
            }
            if (code === codes_1.codes.backslash) {
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
        function consumeLiteral(code) {
            effects.enter(KEYBOARD_TEXT_ESCAPE_TYPE);
            effects.consume(code);
            effects.exit(KEYBOARD_TEXT_ESCAPE_TYPE);
        }
    };
    const tokenizer = {
        tokenize: tokenizeKeyboard,
        resolveAll: (events) => events,
    };
    return {
        text: { [delimiter]: tokenizer },
        insideSpan: { null: [tokenizer] },
        attentionMarkers: { null: [delimiter] },
    };
};
exports.syntax = syntax;
function makeClosingTokenizer(delimiter, size) {
    return function (effects, ok, nok) {
        let current = 0;
        function start() {
            effects.enter(KEYBOARD_MARKER_TYPE);
            return closing;
        }
        function closing(code) {
            if (code === delimiter) {
                effects.consume(code);
                current++;
                if (current === size) {
                    effects.exit(KEYBOARD_MARKER_TYPE);
                    effects.exit(KEYBOARD_TYPE);
                    return ok(code);
                }
                else {
                    return closing;
                }
            }
            return nok(code);
        }
        return start;
    };
}
