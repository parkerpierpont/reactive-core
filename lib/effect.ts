import { currentCtx } from './internal_ctx'
import { EffectFn } from './types'

export function createEffect(fn: EffectFn) {
  currentCtx().runAsCurrentOwner(fn)
}

export function createCleanup(fn: EffectFn) {
  const ctx = currentCtx()
  ctx.cleanups.add(fn)
}
