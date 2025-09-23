# remark-editorial-elements

[![Build][test-badge]][build]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

**[remark][]** extension to support `ins` and `del` elements via
[remark-directive][].

[Docs at shivjm.github.io/remark-extensions.](https://shivjm.github.io/remark-extensions/modules/remark_editorial_elements.html)

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 18+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install remark-editorial-elements
```

## Use

```js
import {micromark} from 'micromark'
import {
  html,
  syntax
} from 'remark-editorial-elements';

// TODO: add example

console.log(output)
```

Yields:

```html
TODO
```

## API

TODO

## License

[ISC][license] © [Shiv Jha Mathur][author]

<!-- Definitions -->

[author]: https://github.com/shivjm

[test-badge]: https://github.com/shivjm/remark-extensions/actions/workflows/test.yml/badge.svg

[build]: https://github.com/shivjm/remark-extensions/actions

[downloads-badge]: https://img.shields.io/npm/dm/remark-editorial-elements.svg

[downloads]: https://www.npmjs.com/package/remark-editorial-elements

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-editorial-elements.svg

[size]: https://bundlephobia.com/result?p=remark-editorial-elements

[npm]: https://docs.npmjs.com/cli/install

[license]: ../../license

[micromark]: https://github.com/micromark/micromark

[from-markdown]: https://github.com/syntax-tree/mdast-util-from-markdown

[to-markdown]: https://github.com/syntax-tree/mdast-util-to-markdown

[remark]: https://github.com/remarkjs/remark

[remark-directive]: https://github.com/remarkjs/remark-directive
