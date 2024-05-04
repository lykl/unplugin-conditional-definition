import postcss from 'postcss'
import type { TransformOptions } from '../types'
import {
  Stack,
  checkStack,
  isConditionalEndStatement,
  isConditionalStartStatement,
  isCurrentEvironment,
  throwError,
} from './core'

export function transformStyle(code: string, id: string, env: string[], opts: TransformOptions) {
  const { mode, sourceMaps, startLine = 0, startColumn = 0 } = opts
  const stack = new Stack<[postcss.Comment, number]>()
  const ast = postcss.parse(code, { map: sourceMaps })
  ast.walkComments((comment, indexed) => {
    if (isConditionalStartStatement(comment.text)) {
      stack.push([comment, indexed])
    }
    else if (isConditionalEndStatement(comment.text)) {
      const lc = stack.pop()
      const line = comment.source?.start ? startLine + comment.source?.start?.line : void 0
      const column = comment.source?.start ? startColumn + comment.source?.start?.column : void 0
      if (!lc)
        throwError('The conditional comment is not closed.', id, line, column)
      if (!isCurrentEvironment(lc[0].text, env, mode) && comment.parent?.nodes) {
        if (lc[0].parent !== comment.parent) {
          throwError(
            'The current path cannot be removed correctly. Make sure that the conditional comments are closed and that the same pair of comments are in the same scope.',
            id,
            line,
            column,
          )
        }
        for (let i = indexed - 1; i > lc[1]; i--) {
          const node = comment.parent.nodes[i]
          comment.parent.removeChild(node)
        }
      }
    }
  })

  checkStack(stack, id, (stack) => {
    const [c] = stack.peek()
    const line = c.source?.start ? startLine + c.source?.start?.line : void 0
    const column = c.source?.start ? startColumn + c.source?.start?.column : void 0
    return {
      line,
      column,
    }
  })

  if (!sourceMaps)
    return { code: ast.toString(), map: null }

  const result = ast.toResult({
    map: sourceMaps && {
      inline: false,
      sourcesContent: true,
      from: id,
    },
    from: id,
    to: id,
  })
  return { code: result.css, map: result.map?.toJSON() ?? null }
}
