import { resolve } from 'node:path'
import unplugin from './core/unplugin'
import type { Options } from './types'

export const loader = resolve(__dirname, 'rspack/loader')
export default unplugin.rspack as (options?: Options) => ReturnType<typeof unplugin.rspack>
