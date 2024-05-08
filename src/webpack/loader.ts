import { isAbsolute, normalize } from 'node:path'
import type { LoaderContext } from 'webpack'
import type { Options } from '@/types'
import { transfromVueSFC } from '@/utils'

function normalizeAbsolutePath(path: string) {
  if (isAbsolute(path))
    return normalize(path)
  else return path
}

export default function loader(this: LoaderContext<Options>, source: string, map: any) {
  const callback = this.async()
  const options = this.getOptions()
  const id = normalizeAbsolutePath(this.resourcePath + (this.resourceQuery || ''))
  const res = transfromVueSFC(source, id, options.env, options.mode, true)
  callback(null, res.code, res.map || map)
}
