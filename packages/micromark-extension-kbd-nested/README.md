# micromark-extension-kbd-nested

[![Build][test-badge]][build]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

**[micromark][]** extension to support `kbd` element syntax with
configurable delimiters, escaping, and arbitrary nesting (e.g.
<kbd><kbd>Ctrl</kbd>+<kbd>x</kbd></kbd>). Based on
[micromark-extension-kbd][].

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 12+ is needed to use it and it must be `import`ed instead of `require`d.

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

const output = micromark('Press ||| ||Ctrl|| + || \| || |||.', {
  extensions: [syntax()],
  htmlExtensions: [html]
})

console.log(output)
```

Yields:

```html
<p>Press <kbd><kbd>Ctrl</kbd>+<kbd>|</kbd></kbd>.</p>
```

## Syntax

Recognizes any sequence of two or more unescaped occurrences of the
delimiter. Nesting is possible by using a longer sequence on the
outside and a shorter sequence on the inside, e.g. `||| ||Ctrl|| +
||x|| |||`. The sequence will be considered to end at the first whitespace character or non-delimiter, including escape characters. For example, these will all produce `<kbd>|</kbd>`:

* `||\|||`
* `|| | ||`
* `||        | ||`
* `++|++` (with a delimiter of `+`)
* `++ | ++` (with a delimiter of `+`)

## API

This package exports the following identifiers: `html`, `syntax`.
There is no default export.

### `html`

Extension for micromark to compile as `<kbd>` elements (can be passed
in `htmlExtensions`).

### `syntax(options?)`

Returns an extension for micromark to parse `kbd` elements (can be
passed in `extensions`).

Setting a delimiter that already has a special meaning will result in
undefined behaviour.

#### `options`

| Name | Description | Default |
|------|-------------|---------|
| `delimiter` | Character to use as delimiter | `|` |

[ISC][license] © [Shiv Jha Mathur][author]

<!-- Definitions -->

[author]: https://github.com/shivjm

[test-badge]: https://github.com/shivjm/micromark-extension-kbd-nested/actions/workflows/test.yml/badge.svg

[build]: https://github.com/shivjm/micromark-extension-kbd-nested/actions

[downloads-badge]: https://img.shields.io/npm/dm/micromark-extension-kbd-nested.svg

[downloads]: https://www.npmjs.com/package/micromark-extension-kbd-nested

[size-badge]: https://img.shields.io/bundlephobia/minzip/micromark-extension-kbd-nested.svg

[size]: https://bundlephobia.com/result?p=micromark-extension-kbd-nested

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[micromark]: https://github.com/micromark/micromark

[micromark-extension-kbd]: https://github.com/zestedesavoir/zmarkdown/tree/next/packages/micromark-extension-kbd

[from-markdown]: https://github.com/syntax-tree/mdast-util-from-markdown

[to-markdown]: https://github.com/syntax-tree/mdast-util-to-markdown

[remark]: https://github.com/remarkjs/remark
