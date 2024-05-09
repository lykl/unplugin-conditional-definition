import type { FilterPattern, createFilter } from '@rollup/pluginutils'
import type { GeneratorResult } from '@babel/generator'
import type { Stack } from './utils'

export interface Options {
  /**
   * Indicates the current environment.
   * Writing Rules: Uppercase letters, separated by '-',
   * Those that do not conform to the rules will be converted.
   *
   */
  env: string[]
  /**
   * This option controls the format of the comments.
   * The `strict` mode will throw an Error if you write comments in the wrong format.
   * The `transform` mode will try to transform your comments to the correct format.
   * The `ignore` mode will ignore the format check.
   * @default 'strict'
   */
  mode?: 'ignore' | 'transform' | 'strict'

  /**
   * transform code in these files
   * @default ['./src\/**\/*']
   */
  scope?: string[]
  /**
   * don't transform code in these files
   */
  external?: string[]

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

  /**
   * Rules to exclude transforming target.
   *
   * @default [/node_modules/, /\.git/, /\.svn/]
   */
  exclude?: FilterPattern
}

export type TransformOptions = Pick<Options, 'mode'> & {
  sourceMaps?: boolean
  startLine?: number
  startColumn?: number
  startOffset?: number
}

export abstract class ConditionalDefinitionImpl<T, P> {
  protected abstract stack: Stack<T>
  abstract env: string[]
  protected abstract id: string
  protected abstract mode: Options['mode']
  protected abstract startOffset: number
  protected abstract startLine: number
  protected abstract startColumn: number
  abstract tryRemove(path: P): void
  abstract clear(): void
}

export interface CreateUnpluginContextReturnType {
  filter: ReturnType<typeof createFilter>
  transform: (code: string, id: string) => GeneratorResult
}
