# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 0.6.6 (2024-04-23)
## 0.6.5 (2024-04-23)
## 0.6.4 (2024-04-23)
## 0.6.3 (2024-04-23)
## 0.6.2 (2024-04-23)
## 0.6.1 (2024-04-23)
## 0.6.0 (2024-04-23)

### ⚠ BREAKING CHANGES

* provide separate CJS and ESM builds
* require pnpm v9 and Node v18
* exclude source files from published packages

### Bug Fixes

* **micromark-extension-kbd-nested:** properly declare types ([32f234e](https://github.com/shivjm/remark-extensions/commit/32f234ea361d9b681bfbbb4a1d72369d1cc3028f))
* **micromark-extension-kbd-nested:** remove `pnpm` from `engines` ([971da00](https://github.com/shivjm/remark-extensions/commit/971da00e08d99a6a6cb00d2e2c9bd8518c8d4798))


### Build System

* exclude source files from published packages ([c8b5b5c](https://github.com/shivjm/remark-extensions/commit/c8b5b5c19ea0fd0f5cedc5aa64294a1280b00504))
* provide separate CJS and ESM builds ([a63e422](https://github.com/shivjm/remark-extensions/commit/a63e4225c3911445289d6be9696df879fab944b6))
* require pnpm v9 and Node v18 ([2942736](https://github.com/shivjm/remark-extensions/commit/29427362a41692c964918ad6d9a3eabebfe4bbcb))

## 0.5.0 (2021-11-10)

### ⚠ BREAKING CHANGES

* **micromark-extension-kbd-nested:** freeze `html`

### Bug Fixes

* **micromark-extension-kbd-nested:** freeze `html` ([e54a3c2](https://github.com/shivjm/remark-extensions/commit/e54a3c2539d982cf40a7860ca52fb302d018a9d6))

## 0.4.0 (2021-11-02)

### ⚠ BREAKING CHANGES

* **micromark-extension-kbd-nested:** update and improve README
* **micromark-extension-kbd-nested:** add test suggested by README
* **micromark-extension-kbd-nested:** add support for variable sequences

### Features

* **micromark-extension-kbd-nested:** add support for variable sequences ([d725d24](https://github.com/shivjm/remark-extensions/commit/d725d24190649dfe0e7cb8e656b4571482c3554d))


### Tests

* **micromark-extension-kbd-nested:** add test suggested by README ([cbac68b](https://github.com/shivjm/remark-extensions/commit/cbac68b9dd584715be36f793b7a660aa541b9c87))


### docs

* **micromark-extension-kbd-nested:** update and improve README ([362920b](https://github.com/shivjm/remark-extensions/commit/362920b09578598c945720c2bb9e24130fdf48fb))

## 0.3.1 (2021-11-02)


### Bug Fixes

* **micromark-extension-kbd-nested:** correctly handle escaped backslashes ([44c0515](https://github.com/shivjm/remark-extensions/commit/44c05153761e7d4af86b877f71e1f74952f3fb7b))

## 0.3.0 (2021-11-02)


### ⚠ BREAKING CHANGES

* **micromark-extension-kbd-nested:** turn unclosed sequences into no-ops
* **micromark-extension-kbd-nested:** preserve space inside `kbd` sequence

### Features

* **micromark-extension-kbd-nested:** turn unclosed sequences into no-ops ([be61d7f](https://github.com/shivjm/remark-extensions/commit/be61d7f36f664adb025f7a1793d7ee87a589950f))


### Bug Fixes

* **micromark-extension-kbd-nested:** preserve space inside `kbd` sequence ([9a6a0eb](https://github.com/shivjm/remark-extensions/commit/9a6a0eb6f654ba469891d20d192df327e86340be))

## 0.2.1 (2021-11-01)


### Bug Fixes

* **micromark-extension-kbd-nested:** put micromark-util-symbol in `dependencies` ([749f300](https://github.com/shivjm/remark-extensions/commit/749f300964b95a286600b206fabdc8598c3d24e4))

## 0.2.0 (2021-11-01)


### ⚠ BREAKING CHANGES

* **micromark-extension-kbd-nested:** put generated files under `lib`

### Features

* **micromark-extension-kbd-nested:** export new function `normalizeDelimiter` ([861a1e0](https://github.com/shivjm/remark-extensions/commit/861a1e0a60bf18be462deabb44684c7a392d53f3))


### Build System

* **micromark-extension-kbd-nested:** put generated files under `lib` ([19a9991](https://github.com/shivjm/remark-extensions/commit/19a9991aee4004bedb614b6a9d09888a8ad43668))

## 0.1.0 (2021-11-01)


### ⚠ BREAKING CHANGES

* convert to pnpm workspace

### Bug Fixes

* **micromark-extension-kbd-nested:** don’t run `npm run build` in `prepublish` ([3960bf1](https://gh-shivjm/shivjm/remark-extensions/commit/3960bf10b40c42027bb86d051c22c40700c51064))
* remove compiled output ([4821340](https://gh-shivjm/shivjm/remark-extensions/commit/482134060eace480387f044494eb6c3a9b919300))


### refactor

* convert to pnpm workspace ([0e8323e](https://gh-shivjm/shivjm/remark-extensions/commit/0e8323e25127d7d060d3b299c40d0b666903bc8d))
