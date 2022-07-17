import type { EffectFn } from './types'
import { renderCtx } from './internal_ctx'

export function render(fn: EffectFn) {
  const ctx = renderCtx(fn)
    .runInitializer()
    // initial update pass
    .runUpdates()

  return () => ctx.runCleanups()
}
