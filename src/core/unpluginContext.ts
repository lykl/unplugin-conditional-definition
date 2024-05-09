import type { CreateUnpluginContextReturnType, Options } from '../types'
import { createFilter } from '@rollup/pluginutils'
import fg from 'fast-glob'
import { DEFAULT_EXCLUDE, LEGALITY_REGEXP, defaultOptions } from './constants'
import { MODE_BEHAVIOR, conditionalDefinition, getAbsoluteFilePaths, getInclude } from '@/utils'
import { UnpluginContextMeta } from 'unplugin'

/**
 * @description: create unplugin context
 * @param {Options} options
 * @return {CreateUnpluginContextReturnType}
 */
export const createUnpluginContext = (options: Options, meta: UnpluginContextMeta): CreateUnpluginContextReturnType => {
  if (meta.framework === 'webpack') delete options.vue
  const filter = createFilter(getInclude(options), options.exclude || DEFAULT_EXCLUDE)
  const transform = (code: string, id: string) => {
    if (options.scope?.length) {
      const entries = fg.sync(options.scope, { absolute: true })
      const isInScope = entries.some((entry) => id.startsWith(entry))
      if (!isInScope)
        return {
          code,
          map: null,
        }
    }
    if (options.external?.length) {
      const entries = fg.sync(options.external, { absolute: true })
      const isExternal = entries.some((entry) => id.startsWith(entry))
      if (isExternal)
        return {
          code,
          map: null,
        }
    }
    if (!options.env.length) {
      return {
        code,
        map: null,
      }
    }
    return conditionalDefinition(
      code,
      id,
      options.env.map((item) =>
        !LEGALITY_REGEXP.test(item)
          ? MODE_BEHAVIOR[(options.mode || defaultOptions.mode) as Options['mode'] & string](item)
          : item,
      ),
      options.mode,
      true,
    )
  }
  return {
    filter,
    transform,
  }
}
