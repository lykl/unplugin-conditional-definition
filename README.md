# unplugin-conditional-compilation

A plugin that selectively compiles code based on environmental variables,for Vite &amp; Webpack &amp; Esbuild &amp; Rollup

<div>
<img src="https://img.shields.io/npm/dm/unplugin-conditional-conpilation" />
<img src="https://img.shields.io/github/last-commit/Talljack/unplugin-conditional-conpilation
">
<img src="https://codecov.io/gh/Talljack/unplugin-conditional-conpilation/graph/badge.svg?token=KI043GVTMM"/>
</div>

## Install

```bash
[npm|pnpm] i unplugin-conditional-definition -D

or

yarn add unplugin-conditional-definition -D
```

## Demo

Example: [`playground/`](./playground/)

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import viteConditionalDefinition from 'unplugin-conditional-definition/vite'

export default defineConfig({
  plugins: [
    viteConditionalDefinition({
      /**
       * your enviorment string
       * type:string
       */
      env: [],
      // type : 'strict' | 'ignore' | 'transform'
      mode: 'strict',
      // filters for transforming targets
      exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.svn[\\/]/],
    }),
  ],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import rollupConditionalDefinition from 'unplugin-conditional-definition/rollup'

export default {
  plugins: [
    rollupConditionalDefinition({
      /**
       * your enviorment string
       * type:string
       */
      env: [],
      // type : 'strict' | 'ignore' | 'transform'
      mode: 'strict',
      // filters for transforming targets
      exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.svn[\\/]/],
    }),
  ],
}
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
const webpackConditionalDefinition = require('unplugin-conditional-definition/webpack').default
const ConditionalDefinitionLoader = require('unplugin-conditional-definition/webpack').loader
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  /* ... */
  module: {
    rules: [
      /* ... */
      // you must use the loader to transform your vue code
      {
        test: /\.vue$/,
        use: ['vue-loader', ConditionalDefinitionLoader],
      },
      /* ... */
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    webpackConditionalDefinition({
      /**
       * your enviorment string
       * type:string
       */
      env: [],
    }),
  ],
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import esbuildConditionalDefinition from 'unplugin-conditional-definition/esbuild'

build({
  plugins: [
    esbuildConditionalDefinition({
      /**
       * your enviorment string
       * type:string
       */
      env: [],
    }),
  ],
})
```

<br></details>

<details>
<summary>Rspack  (
  <g-emoji class="g-emoji" alias="warning">⚠️</g-emoji>
   experimental)</summary><br>

```ts
// rspack.config.js
const RspackPlugin = require('unplugin-conditional-definition/rspack').default

module.exports = {
  plugins: [
    new rspack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    RspackPlugin({
      /**
       * your enviorment string
       * type:string
       */
      env: [],
    }),
  ],
}
```

<br></details>

<details>
<summary>
  Rolldown
  (
  <g-emoji class="g-emoji" alias="warning">⚠️</g-emoji>
   experimental)
</summary>
<br>

```ts
// rolldown.config.js
import { defineConfig } from 'rolldown'
import Rolldown from 'unplugin-conditional-definition/rolldown'

export default defineConfig({
  plugins: [
    Rolldown({
      // your enviorment string type:string
      env: [],
    }),
  ],
})
```

<br></details>

## Configuration

The following shows the default values of the configuration

```ts
ConditionalDefinition({
  /**
   * your enviorment string
   * @type string[]
   */
  env: [],
  /**
   * This option controls the format of the comments.
   * The `strict` mode will throw an Error if you write comments in the wrong format.
   * The `transform` mode will try to transform your comments to the correct format.
   * The `ignore` mode will ignore the format check.
   * @type 'strict' | 'ignore' | 'transform'
   */
  mode: 'strict',
  /**
   * Whether js compilation is enabled
   * @default true
   */
  js?: boolean
  /**
   * Same as js
   * @default false
   */
  css?: boolean
  /**
   * Same as js
   * Webpack does not support. If you want to transform .vue files, you must add loader after the vue-loader
   * @default false
   */
  vue?: boolean
  /**
   * Same as js
   * @default false
   */
  html?: boolean
  // filters for transforming targets
  exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.svn[\\/]/],
})
```

## CHANGELOG

You can see [CHANGELOG](./CHANGELOG.md) here.

## License

MIT License © 2024-PRESENT [lykl](https://github.com/lykl)
