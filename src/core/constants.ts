import type { Options, TransformOptions } from '@/types'

export const CONDITIONAL_START_STATEMENT_REGEXP = /^\s*#ifn?def\s*/

export const CONDITIONAL_END_STATEMENT_REGEXP = /\s*#endif\s*/

export const CONDITIONAL_NOT_START_STATEMENT_REGEXP = /^\s*#ifndef\s*/

export const ENVIRONMENT_REGEXP = /\b[\w-]+\b/g

export const LEGALITY_REGEXP = /^(?![-\d])(?!.*-$)([A-Z\d]+-?[A-Z\d]*)+$/

export const VUE_FILE_REGEXP = /\.vue$/

export const SVELTE_FILE_REGEXP = /\.svelte$/

export const HTML_FILE_REGEXP = /\.html$/

export const CSS_FILE_REGEXP = /\.(?:sa|s?c|le)ss$/

export const JS_FILE_REGEXP = /\.[jt]sx?$/

export const DEFAULT_INCLUDE = [JS_FILE_REGEXP, VUE_FILE_REGEXP, SVELTE_FILE_REGEXP, HTML_FILE_REGEXP, CSS_FILE_REGEXP]

export const DEFAULT_EXCLUDE = [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.svn[\\/]/]

export const defaultOptions: Options = {
  env: [],
  mode: 'strict',
  include: DEFAULT_INCLUDE,
  exclude: DEFAULT_EXCLUDE,
}

export const defaultTransformOpiton: TransformOptions = {
  mode: defaultOptions.mode,
  sourceMaps: false,
  startLine: 1,
  startColumn: 1,
  startOffset: 0,
}
