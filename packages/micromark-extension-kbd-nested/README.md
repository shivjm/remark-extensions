# micromark-extension-kbd-nested

[![Build][test-badge]][build]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

**[micromark][]** extension to support `kbd` element syntax with
configurable delimiters, escaping, `var` sequences, and arbitrary
nesting (e.g. <kbd><kbd>Ctrl</kbd> + <kbd><var>key</var></kbd></kbd>).

[Docs at shivjm.github.io/remark-extensions.](https://shivjm.github.io/remark-extensions/modules/micromark_extension_kbd_nested.html)

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 18+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install micromark-extension-kbd-nested
```

## Use

```js
import {micromark} from 'micromark'
import {
  html,
  syntax
} from 'micromark-extension-kbd-nested';

const output = micromark('Press ||| ||Ctrl|| + || \| || |||, then || //key// ||.', {
  extensions: [syntax()],
  htmlExtensions: [html]
})

console.log(output)
```

Yields:

```html
<p>Press <kbd><kbd>Ctrl</kbd> + <kbd>|</kbd></kbd>, then <kbd><var>key</var></kbd>.</p>
```

## Syntax

### Keyboard sequences
Recognizes any sequence of two or more unescaped occurrences of
`delimiter` (defaults to `|`) as a keyboard sequence.
  
* All is preserved except immediately after an opening sequence or
  immediately before a closing sequence.
* Nesting is possible by using a longer sequence on the outside and a
  shorter sequence on the inside, e.g. `||| ||Ctrl|| + ||x|| |||` will
  be turned into <kbd><kbd>Ctrl</kbd> + <kbd>x</kbd></kbd>.
* The opening sequence will be considered to end at the first
  whitespace character or non-delimiter, including escape characters.
  For example, these will all produce `<kbd>|</kbd>`:
  * `||\|||`
  * `|| | ||`
  * `||        | ||`
  * `++|++` (with a delimiter of `+`)
  * `++ | ++` (with a delimiter of `+`)
  
### Variable sequence
`variableDelimiter` (defaults to `/`) can be used *within* keyboard
sequences to mark variable sections.

* Must always use two variable delimiters.
* Cannot be nested.
* All is preserved except immediately after an opening sequence or
  immediately before a closing sequence.

## API

This package exports the following identifiers: `html`, `syntax`.
There is no default export.

### `html`

Extension for micromark to compile as `<kbd>` and `<var>` elements
(can be passed in `htmlExtensions`).

### `syntax(options?)`

Returns an extension for micromark to parse keyboard sequences
optionally containing variable sequences (can be passed in
`extensions`).

Do not pass characters that are already being processed specially as
the delimiters.

#### `options`

| Name | Description | Default |
|------|-------------|---------|
| `delimiter` | Character to use as delimiter | `|` |
| `variableDelimiter` | Character to use as variable delimiter | `/` |

## License

[ISC][license] © [Shiv Jha Mathur][author]

<!-- Definitions -->

[author]: https://github.com/shivjm

[test-badge]: https://github.com/shivjm/remark-extensions/actions/workflows/test.yml/badge.svg

[build]: https://github.com/shivjm/remark-extensions/actions

[downloads-badge]: https://img.shields.io/npm/dm/micromark-extension-kbd-nested.svg

[downloads]: https://www.npmjs.com/package/micromark-extension-kbd-nested

[size-badge]: https://img.shields.io/bundlephobia/minzip/micromark-extension-kbd-nested.svg

[size]: https://bundlephobia.com/result?p=micromark-extension-kbd-nested

[npm]: https://docs.npmjs.com/cli/install

[license]: ../../license

[micromark]: https://github.com/micromark/micromark

[from-markdown]: https://github.com/syntax-tree/mdast-util-from-markdown

[to-markdown]: https://github.com/syntax-tree/mdast-util-to-markdown

[remark]: https://github.com/remarkjs/remark
