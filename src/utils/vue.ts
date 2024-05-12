import type { CommentNode, Node } from '@vue/compiler-core'
import { NodeTypes } from '@vue/compiler-core'
import { parse } from '@vue/compiler-sfc'
import MagicString from 'magic-string'
import { Stack, checkStack, bfs, isConditionalEndStatement, isConditionalStartStatement, throwError } from './core'
import { transformScript } from './script'
import { transformStyle } from './style'
import { isCurrentEvironment } from '.'
import type { Options } from '@/types'

interface MaybeParentNode extends Node {
  children?: Node[]
}

function isCommentNode(node: Node): node is CommentNode {
  return node.type === NodeTypes.COMMENT
}

export function transfromVueSFC(
  code: string,
  id: string,
  env: string[],
  mode: Options['mode'] = 'strict',
  sourceMaps: boolean = false,
) {
  const stack = new Stack<[CommentNode, MaybeParentNode]>()
  const ast = parse(code, {
    templateParseOptions: {
      comments: true,
    },
    filename: id,
    sourceMap: false,
  })
  const ms = new MagicString(code, { filename: ast.descriptor.filename })
  const { template, script, scriptSetup, styles } = ast.descriptor
  if (template?.ast) {
    bfs<MaybeParentNode>(
      template.ast,
      null,
      (node, parentNode) => {
        if (!parentNode) return
        if (isCommentNode(node)) {
          if (isConditionalStartStatement(node.content)) {
            stack.push([node, parentNode])
          } else if (isConditionalEndStatement(node.content)) {
            const lc = stack.pop()
            if (!lc)
              throwError('The conditional comment is not closed.', id, node.loc.start.line, node.loc.start.column)
            if (!isCurrentEvironment(lc[0].content, env, mode)) {
              if (parentNode !== lc[1]) {
                throwError(
                  'The current path cannot be removed correctly. Make sure that the conditional comments are closed and that the same pair of comments are in the same scope.',
                  id,
                  node.loc.start.line,
                  node.loc.start.column,
                )
              }
              ms.remove(lc[0].loc.end.offset, node.loc.start.offset)
              return true
            }
          }
        }
      },
      (node) => node.children,
    )
    checkStack(stack, id, (stack) => {
      const [c] = stack.peek()
      return {
        line: c.loc.start.line,
        column: c.loc.start.column,
      }
    })
  }

  if (script) {
    const { line, offset } = script.loc.start
    const { code } = transformScript(script.content, id, env, {
      mode,
      sourceMaps: false,
      startLine: line - 1, // because the line is start from block head so we need to subtract 1
      // startColumn: column,
      // startOffset: offset,
    })
    ms.update(offset, script.loc.end.offset, `${code}\n`)
  }

  if (scriptSetup) {
    const { line, offset } = scriptSetup.loc.start
    const { code } = transformScript(scriptSetup.content, id, env, {
      mode,
      sourceMaps: false,
      startLine: line - 1,
      // startColumn: column,
      // startOffset: offset,
    })
    ms.update(offset, scriptSetup.loc.end.offset, `${code}\n`)
  }

  if (styles) {
    for (const style of styles) {
      const { offset, line } = style.loc.start
      const { code } = transformStyle(style.content.replace(/^\\n|\\n$/, ''), id, env, {
        mode,
        sourceMaps,
        startLine: line - 1,
        // startColumn: column,
        // startOffset: offset,
      })
      ms.update(offset, style.loc.end.offset, code)
    }
  }

  return {
    code: ms.toString(),
    map: /* sourceMaps ? ms.generateMap({ hires: true, source: ast.descriptor.filename, includeContent: true }) : */ null,
  }
}
