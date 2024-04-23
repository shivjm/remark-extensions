# remark-kbd-nested

[![Build][test-badge]][build]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

**[remark][]** extension to support `kbd` element syntax with
configurable delimiters, escaping, `var` sequences, and arbitrary
nesting (e.g. <kbd><kbd>Ctrl</kbd> + <kbd><var>key</var></kbd></kbd>).

[Docs at shivjm.github.io/remark-extensions.](https://shivjm.github.io/remark-extensions/modules/remark_kbd_nested.html)

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 18+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install micromark-extension-kbd-nested
```

## Use

```javascript
import { remark } from "remark";
import { remarkKbdNested } from "remark-kbd-nested";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const output = remark()
      .use(remarkKbdNested)
      .use(remarkRehype)
      .use(rehypeStringify)
      .processSync("Press ||| ||Ctrl|| + || \| || |||, then || //key// ||.");

console.log(String(output));
```

Yields:

```html
<p>Press <kbd><kbd>Ctrl</kbd> + <kbd>|</kbd></kbd>, then <kbd><var>key</var></kbd>.</p>
```

## Syntax

See [micromark-extension-kbd-nested][].

## API

### `remarkKbdNested(options?)`

Returns a remark plugin to parse keyboard sequences optionally
containing variable sequences (can be passed to `use`). The options
are passed directly to [micromark-extension-kbd-nested][].

## License

[ISC][LICENSE] © [Shiv Jha Mathur][author]

[test-badge]: https://github.com/shivjm/remark-extensions/actions/workflows/test.yml/badge.svg

[build]: https://github.com/shivjm/remark-extensions/actions

[downloads-badge]: https://img.shields.io/npm/dm/remark-kbd-nested.svg

[downloads]: https://www.npmjs.com/package/remark-kbd-nested

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-kbd-nested.svg

[size]: https://bundlephobia.com/result?p=remark-kbd-nested

[remark]: https://github.com/remarkjs/remark

[npm]: https://docs.npmjs.com/cli/install

[micromark-extension-kbd-nested]: https://www.npmjs.com/package/micromark-extension-kbd-nested

[license]: ../../license

[author]: https://github.com/shivjm/
