# remark-textras

[![Build][test-badge]][build]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

**[remark][]** extension to provide small helpers via
[remark-directive][]. (Comprehensive documentation will be added
soon.)

[Docs at shivjm.github.io/remark-extensions.](https://shivjm.github.io/remark-extensions/modules/remark_textras.html)

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 18+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install remark-textras
```

## Use

```js
import {micromark} from 'micromark'
import {
  html,
  syntax
} from 'remark-textras';

// TODO: add example

console.log(output)
```

Yields:

```html
TODO
```

## Syntax

Most of these have a one-to-one correspondence with an HTML element.

### `:ordinal`

```markdown
It happened on the 27:ordinal[th] of May.
```

### `:quote`

```markdown
And then he said, :quote[What ho!].
```

Adds special marker classes if a quotation mark is found at the beginning or end of its contents.

### `:var`

```markdown
In the invocation above, :var[degree] is the desired rotation.
```

### `:abbr`

```markdown
This page is built using :abbr[HTML] and :abbr[CSS].
```

### `:samp`

```markdown
At this point, the program should fail with an error like :samp[Invalid fizz provided].
```

### `:work`

```markdown
See the aforementioned :work[A Real Pain] and :work[Futurama]{year="1999"}.
```

## API

TODO

## License

[ISC][license] © [Shiv Jha Mathur][author]

<!-- Definitions -->

[author]: https://github.com/shivjm

[test-badge]: https://github.com/shivjm/remark-extensions/actions/workflows/test.yml/badge.svg

[build]: https://github.com/shivjm/remark-extensions/actions

[downloads-badge]: https://img.shields.io/npm/dm/remark-textras.svg

[downloads]: https://www.npmjs.com/package/remark-textras

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-textras.svg

[size]: https://bundlephobia.com/result?p=remark-textras

[npm]: https://docs.npmjs.com/cli/install

[license]: ../../license

[micromark]: https://github.com/micromark/micromark

[from-markdown]: https://github.com/syntax-tree/mdast-util-from-markdown

[to-markdown]: https://github.com/syntax-tree/mdast-util-to-markdown

[remark]: https://github.com/remarkjs/remark

[remark-directive]: https://github.com/remarkjs/remark-directive
