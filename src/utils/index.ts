import type { GeneratorResult } from '@babel/generator'
import { CSS_FILE_REGEXP, HTML_FILE_REGEXP, JS_FILE_REGEXP, VUE_FILE_REGEXP } from '../core/constants'
import type { Options } from '../types'
import { transfromVueSFC } from './vue'
import { transformScript } from './script'
import { transformStyle } from './style'
import { transformHTML } from './html'

export * from './core'
export * from './html'
export * from './script'
export * from './style'
export * from './vue'

export function isVue(filename: string) {
  return VUE_FILE_REGEXP.test(filename)
}

export function isStyle(filename: string) {
  return CSS_FILE_REGEXP.test(filename)
}

export function isHTML(filename: string) {
  return HTML_FILE_REGEXP.test(filename)
}

export function isJsOrJsx(filename: string) {
  return JS_FILE_REGEXP.test(filename)
}

export function conditionalDefinition(
  code: string,
  id: string,
  env: string[],
  mode: Options['mode'] = 'strict',
  sourceMaps = false,
): GeneratorResult {
  if (isVue(id))
    return transfromVueSFC(code, id, env, mode, sourceMaps)

  if (isStyle(id))
    return transformStyle(code, id, env, { mode, sourceMaps }) as unknown as GeneratorResult

  if (isHTML(id))
    return transformHTML(code, id, env, { mode, sourceMaps })

  if (isJsOrJsx(id))
    return transformScript(code, id, env, { mode, sourceMaps })

  return {
    code,
    map: null,
  }
}
