import { createFilter } from '@rollup/pluginutils'
import type { CreateUnpluginContextReturnType, Options } from '../types'
import { DEFAULT_EXCLUDE, DEFAULT_INCLUDE, LEGALITY_REGEXP } from './constants'
import { MODE_BEHAVIOR, conditionalDefinition } from '@/utils'

/**
 * @description: create unplugin context
 * @param {Options} options
 * @return {CreateUnpluginContextReturnType}
 */
export const createUnpluginContext = (options: Options): CreateUnpluginContextReturnType => {
  const filter = createFilter(options.include || DEFAULT_INCLUDE, options.exclude || DEFAULT_EXCLUDE)
  const transform = (code: string, id: string) => {
    return options.env.length
      ? conditionalDefinition(
        code,
        id,
        options.env.map(item => (!LEGALITY_REGEXP.test(item) ? MODE_BEHAVIOR[options.mode](item) : item)),
        options.mode,
        true,
      )
      : { code, map: null }
  }
  return {
    filter,
    transform,
  }
}
