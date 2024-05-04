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
  mode: 'ignore' | 'transform' | 'strict'
  /**
   * Rules to include transforming target.
   *
   * @default [/\.[jt]sx?$/, /\.vue$/, /\.svelte$/]
   */
  include?: FilterPattern

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
