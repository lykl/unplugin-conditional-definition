import { parse } from 'parse5'
import MagicString from 'magic-string'
import type { DefaultTreeAdapterMap } from 'parse5'
import {
  Stack,
  checkStack,
  bfs,
  isConditionalEndStatement,
  isConditionalStartStatement,
  isCurrentEvironment,
  throwError,
} from './core'
import { transformScript } from './script'
import { transformStyle } from './style'
import type { TransformOptions } from '@/types'

function isCommentNode(node: DefaultTreeAdapterMap['node']): node is DefaultTreeAdapterMap['commentNode'] {
  return node.nodeName === '#comment'
}
function isScriptNode(node: DefaultTreeAdapterMap['node']): node is DefaultTreeAdapterMap['element'] {
  return node.nodeName === 'script'
}
function isStyleNode(node: DefaultTreeAdapterMap['node']): node is DefaultTreeAdapterMap['element'] {
  return node.nodeName === 'style'
}
function isTextNode(node: DefaultTreeAdapterMap['node']): node is DefaultTreeAdapterMap['textNode'] {
  return node.nodeName === '#text'
}

export function transformHTML(code: string, id: string, env: string[], opts: TransformOptions) {
  const { mode, sourceMaps } = opts
  const ast = parse(code, { sourceCodeLocationInfo: true })
  const stack = new Stack<DefaultTreeAdapterMap['commentNode']>()
  const ms = new MagicString(code)
  bfs(
    ast as unknown as DefaultTreeAdapterMap['childNode'],
    null,
    (node) => {
      if (isScriptNode(node)) {
        const scriptTextNode = node.childNodes[0]
        if (!scriptTextNode || !isTextNode(scriptTextNode)) return
        const { startLine } = node.sourceCodeLocation!
        const { code } = transformScript(scriptTextNode.value, id, env, {
          mode,
          sourceMaps,
          startLine: startLine - 1,
          startColumn: 1,
          // startOffset,
        })
        ms.update(scriptTextNode.sourceCodeLocation!.startOffset, scriptTextNode.sourceCodeLocation!.endOffset, code)
        return true
      }
      if (isStyleNode(node)) {
        const styleTextNode = node.childNodes[0]
        if (!styleTextNode || !isTextNode(styleTextNode)) return
        const { startLine } = node.sourceCodeLocation!
        const { code } = transformStyle(styleTextNode.value, id, env, {
          mode,
          sourceMaps,
          startLine: startLine - 1,
          startColumn: 1,
          // startOffset,
        })
        ms.update(styleTextNode.sourceCodeLocation!.startOffset, styleTextNode.sourceCodeLocation!.endOffset, code)
        return true
      }
      if (!isCommentNode(node)) return
      if (isConditionalStartStatement(node.data)) {
        stack.push(node)
      } else if (isConditionalEndStatement(node.data)) {
        const lc = stack.pop()
        if (!lc) {
          throwError(
            'The conditional comment is not closed.',
            id,
            node.sourceCodeLocation?.startLine,
            node.sourceCodeLocation?.startCol,
          )
        }
        if (!isCurrentEvironment(lc.data, env, mode)) {
          if (lc.parentNode !== node.parentNode) {
            throwError(
              'The current path cannot be removed correctly. Make sure that the conditional comments are closed and that the same pair of comments are in the same scope.',
              id,
              node.sourceCodeLocation?.startLine,
              node.sourceCodeLocation?.startCol,
            )
          }
          ms.remove(node.sourceCodeLocation!.startOffset, node.sourceCodeLocation!.endOffset)
          return true
        }
      }
    },
    (node) => (node as DefaultTreeAdapterMap['element']).childNodes,
  )
  checkStack(stack, id, (stack) => {
    const c = stack.peek()
    return {
      line: c.sourceCodeLocation?.startLine,
      column: c.sourceCodeLocation?.startCol,
    }
  })

  return {
    code: ms.toString(),
    map: sourceMaps ? ms.generateMap({ hires: true, includeContent: true, source: id }) : null,
  }
}
