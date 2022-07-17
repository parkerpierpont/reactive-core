import { currentCtx } from './internal_ctx'
import type { Getter, Setter, EqualityOptions, EffectFn } from './types'

class StateAtom<T> {
  #value: T
  #check_eq: (a: T, b: T) => boolean
  #observers = new Set<EffectFn>()
  constructor(
    initial_value: T,
    options: EqualityOptions<T> = { equals: true },
  ) {
    this.#value = initial_value
    if ('equalityFn' in options && options.equalityFn)
      // custom equality fn
      this.#check_eq = options.equalityFn
    else if ('equals' in options && !options.equals)
      // always false
      this.#check_eq = (_a, _b) => false
    else this.#check_eq = (a, b) => a === b
  }

  get value(): T {
    const ctx = currentCtx()
    this.#observers.add(ctx.currentOwner)
    return this.#value
  }

  set value(newValue: T) {
    if (this.#check_eq(newValue, this.#value)) return
    this.#value = newValue
    const ctx = currentCtx()
    this.#observers.forEach(fn => {
      if (typeof fn !== 'function') this.#observers.delete(fn)
      else {
        ctx.updates.add(fn)
        ctx.markDirty()
      }
    })
  }
}

/**
 * Create a reactive state.
 * @param initialValue - the initial value to use
 * @param options - custom equality options
 */
export const createState = <T>(
  initialValue: T,
  options?: EqualityOptions<T>,
): [getter: Getter<T>, setter: Setter<T>] => {
  const stateAtom = new StateAtom(initialValue, options)
  return [() => stateAtom.value, (newValue: T) => (stateAtom.value = newValue)]
}
