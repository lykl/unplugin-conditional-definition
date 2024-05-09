import { isAbsolute, normalize } from 'node:path'
import type { LoaderContext } from 'webpack'
import type { Options } from '@/types'
import { transfromVueSFC } from '@/utils'
import fg from 'fast-glob'

function normalizeAbsolutePath(path: string) {
  if (isAbsolute(path)) return normalize(path)
  else return path
}

export default function loader(this: LoaderContext<Options>, source: string, map: any) {
  const callback = this.async()
  const options = this.getOptions()
  const id = normalizeAbsolutePath(this.resourcePath + (this.resourceQuery || ''))
  if (options.scope?.length) {
    const entries = fg.sync(options.scope, { absolute: true })
    const isInScope = entries.some((entry) => id.startsWith(entry))
    if (!isInScope) {
      callback(null, source, map)
      return
    }
  }
  if (options.external?.length) {
    const entries = fg.sync(options.external, { absolute: true })
    const isExternal = entries.some((entry) => id.startsWith(entry))
    if (isExternal) {
      callback(null, source, map)
      return
    }
  }
  if (!options.env.length) {
    callback(null, source, map)
    return
  }
  if (options.exclude) {
    const exclude = Array.isArray(options.exclude) ? options.exclude : [options.exclude]
    if (exclude.some((item) => new RegExp(item).test(id))) {
      callback(null, source, map)
      return
    }
  }
  const res = transfromVueSFC(source, id, options.env, options.mode, true)
  callback(null, res.code, res.map || map)
}
