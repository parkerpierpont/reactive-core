import type { BuilderFn, EffectFn, RenderContext } from './types'

// The currently active context
let active_ctx: RenderContext<EffectFn | typeof globalThis>

function _renderCtx(
  this: RenderContext<EffectFn | typeof globalThis>,
  ctx: EffectFn | typeof globalThis,
): RenderContext<EffectFn | typeof globalThis> {
  // @ts-ignore
  if (!(this instanceof _renderCtx)) return new _renderCtx(ctx)

  this.target = new EventTarget()
  // the rendering context
  this.ctx = ctx
  // the current owner
  this.currentOwner = () => {}
  // a list of updates that should run when it's dependant states change
  this.updates = new Set()
  // a list of cleanup functions that should run before unmount
  this.cleanups = new Set()

  // mark that updates should run
  this.markDirty = () =>
    this.target.dispatchEvent(new CustomEvent('updatesReady'))

  const self: RenderContext = this as RenderContext
  // Make a copy of an effect function that runs within this context.
  const contextualize =
    (fun: EffectFn): BuilderFn =>
    (): RenderContext => {
      let prevCtx = currentCtx()
      active_ctx = this
      fun()
      active_ctx = prevCtx
      return self
    }

  // Initialize the runtime & component setup
  let initialized = false
  this.runInitializer = contextualize(() => {
    if (initialized) return
    initialized = true
    typeof this.ctx === 'function' && this.ctx() // in case we want a global ctx
  })

  // Run all updates
  this.runUpdates = contextualize(() => {
    this.updates.forEach((cb: EffectFn) => {
      this.updates.delete(cb)
      cb()
    })
  })

  // Run all cleanup functions
  this.runCleanups = contextualize(() => {
    console.log('Running %d cleanup fns.', this.cleanups.size)
    this.cleanups.forEach(cb => {
      this.cleanups.delete(cb)
      cb()
    })
  })

  // Run something with the ctx set to another effect
  this.runAsCurrentOwner = (fn: EffectFn) => {
    let prevOwner = this.currentOwner
    this.currentOwner = fn
    fn()
    this.currentOwner = prevOwner
  }

  let willUpdate = false
  this.target.addEventListener('updatesReady', () => {
    if (willUpdate) return
    willUpdate = true
    requestIdleCallback(() => {
      this.runUpdates()
      willUpdate = false
    })
  })

  return this
}

/**
 * Create a new rendering context.
 * @param ctx - the rendering context, usually a client-code render function.
 */
export const renderCtx = <T extends EffectFn | typeof globalThis = EffectFn>(
  ctx: T,
  // @ts-expect-error this is wrong bc of 'this' or something
): RenderContext<T> => _renderCtx(ctx)

// the global context – used if a render fn hasn't been called yet
active_ctx = renderCtx(globalThis)

/**
 * Get the active rendering context.
 */
export function currentCtx(): RenderContext<EffectFn | typeof globalThis> {
  return active_ctx
}
