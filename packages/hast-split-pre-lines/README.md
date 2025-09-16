# hast-split-pre-lines

[![Build][test-badge]][build]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

**[hast][]** utility to split newline-delimited `pre` text (inside specific elements) into one `span` per line while maintaining integrity of tags.

[Docs at shivjm.github.io/remark-extensions.](https://shivjm.github.io/remark-extensions/modules/hast_split_pre_lines.html)

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 18+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install hast-split-pre-lines
```

## Use

```javascript
import debug from "debug";
import * as select from "hast-util-select";
import { splitLines } from "hast-split-pre-lines";

const processPresDebug = debug("ProcessPres");

export function processPres(tree) {
    const pres = select.selectAll("pre", tree);

    for (const pre of pres) {
      splitLines(pre, { debug: processPresDebug });
    }
}
```

An element like this:

```html
<pre><code class="language-javascript"><span class="token keyword">const</span> <span class="token constant">DEFAULT_LINE_CLASS</span> <span class="token operator">=</span> <span class="token string">"line"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">DEFAULT_OPTIONS</span><span class="token operator">:</span> Readonly<span class="token operator">&lt;</span>Options<span class="token operator">&gt;</span> <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">freeze</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">lineClass</span><span class="token operator">:</span> <span class="token constant">DEFAULT_LINE_CLASS</span><span class="token punctuation">,</span>
  <span class="token literal-property property">elementsToSplit</span><span class="token operator">:</span> <span class="token constant">DEFAULT_ELEMENTS_TO_SPLIT</span><span class="token punctuation">,</span>
  <span class="token literal-property property">debug</span><span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">NEWLINE_RE</span> <span class="token operator">=</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\n</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">;</span>
</code></pre>
```

Becomes:

```html
<pre class="language-javascript"><code class="language-javascript" data-digits="1"><span class="line" data-line="1"><span class="line-content"><span class="token keyword">const</span> <span class="token constant">DEFAULT_LINE_CLASS</span> <span class="token operator">=</span> <span class="token string">"line"</span><span class="token punctuation">;</span>
    </span></span><span class="line" data-line="2"><span class="line-content">
    </span></span><span class="line" data-line="3"><span class="line-content"><span class="token keyword">const</span> <span class="token constant">DEFAULT_OPTIONS</span><span class="token operator">:</span> <span class="token maybe-class-name">Readonly</span><span class="token operator">&#x3C;</span><span class="token maybe-class-name">Options</span><span class="token operator">></span> <span class="token operator">=</span> <span class="token known-class-name class-name">Object</span><span class="token punctuation">.</span><span class="token method function property-access">freeze</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    </span></span><span class="line" data-line="4"><span class="line-content">  <span class="token literal-property property">lineClass</span><span class="token operator">:</span> <span class="token constant">DEFAULT_LINE_CLASS</span><span class="token punctuation">,</span>
    </span></span><span class="line" data-line="5"><span class="line-content">  <span class="token literal-property property">elementsToSplit</span><span class="token operator">:</span> <span class="token constant">DEFAULT_ELEMENTS_TO_SPLIT</span><span class="token punctuation">,</span>
    </span></span><span class="line" data-line="6"><span class="line-content">  <span class="token literal-property property">debug</span><span class="token operator">:</span> <span class="token keyword nil">undefined</span><span class="token punctuation">,</span>
    </span></span><span class="line" data-line="7"><span class="line-content"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    </span></span><span class="line" data-line="8"><span class="line-content">
    </span></span><span class="line" data-line="9"><span class="line-content"><span class="token keyword">const</span> <span class="token constant">NEWLINE_RE</span> <span class="token operator">=</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">\n</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">;</span></span></span></code></pre>
```

## API

### `splitLines(pre, options?)`

Split the contents of the first allowed element in `pre` into one `span` element per line (denoted by `\n`). Each individual line is wrapped in a `span` with the specified class, inside which is another span whose class has `-content` appended to it, and has a `data-line` attribute. The containing element gains a `data-digits` attribute. `options` is shallowly merged with `DEFAULT_OPTIONS`.

#### Options

| Name               | Type                                                          | Default                     |
|--------------------|---------------------------------------------------------------|-----------------------------|
| `lineClass`        | `string`                                                      | `"line"`                    |
| `elementsToSplit`  | `Set<string>`                                                 | `new Set(["code", "samp"])` |
| `debug` (optional) | `Debugger` (see [debug](https://www.npmjs.com/package/debug)) |                             |

## License

[ISC][LICENSE] © [Shiv Jha Mathur][author]

[test-badge]: https://github.com/shivjm/remark-extensions/actions/workflows/test.yml/badge.svg

[build]: https://github.com/shivjm/remark-extensions/actions

[downloads-badge]: https://img.shields.io/npm/dm/hast-split-pre-lines.svg

[downloads]: https://www.npmjs.com/package/hast-split-pre-lines

[size-badge]: https://img.shields.io/bundlephobia/minzip/hast-split-pre-lines.svg

[size]: https://bundlephobia.com/result?p=hast-split-pre-lines

[hast]: https://github.com/syntax-tree/hast

[remark]: https://github.com/remarkjs/remark

[npm]: https://docs.npmjs.com/cli/install

[license]: ../../license

[author]: https://github.com/shivjm/
