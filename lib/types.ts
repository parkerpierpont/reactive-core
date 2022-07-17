// State
export type Getter<T> = () => T
export type Setter<T> = (value: T) => void
export type StateFn<T> = Getter<T> | Setter<T>
export type EqualityOptions<T> =
  | {
      equalityFn?: (newVal: T, oldVal: T) => boolean
    }
  | {
      equals: boolean
    }

// Render Context
export type EffectFn = () => void
export type BuilderFn = () => RenderContext
export interface RenderContext<T = EffectFn> {
  new (): RenderContext
  (): RenderContext
  target: EventTarget
  ctx: T
  currentOwner: EffectFn
  updates: Set<EffectFn>
  cleanups: Set<EffectFn>
  markDirty: EffectFn
  runInitializer: BuilderFn
  runUpdates: BuilderFn
  runCleanups: BuilderFn
  runAsCurrentOwner: (fn: EffectFn) => void
}
