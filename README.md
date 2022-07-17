# Reactive Core

About 1kb gzipped, and includes the basics of what's needed to make reactive components (State, Effects, Cleanup, Rendering).

This is a simple, small project I used for learning more about reactive primitives. It uses closures for state (like Solid-JS) to automate each effect's dependency graph.

NOTICE: this is not tested, and shouldn't be used in production. Try [S-JS](https://github.com/adamhaile/S) instead.

Here's [part of an example](./example/index.ts):

```ts
import { render, createCleanup, createEffect, createState } from 'reactive-core'

const stopRendering = render(() => {
  // Reactive state initialization
  const [count, setCount] = createState(0)

  const incrementCount = () => setCount(count() + 1)
  const stop = () => stopRendering()

  // the functions passed to makeButton will be called when buttons are clicked
  const button = makeButton(incrementCount)
  const stopButton = makeButton(stop)

  // Keeps the main button's inner text in-sync with count automatically.
  createEffect(() => (button.innerText = `Clicks: ${count()}`))

  stopButton.innerText = 'Stop Rendering'

  // Runs when the 'stopRendering' function is called.
  createCleanup(() => {
    // cleanup our buttons from the dom
    removeEl(button)
    removeEl(stopButton)
  })
})
```
