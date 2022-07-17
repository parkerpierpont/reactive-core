import { render, createCleanup, createEffect, createState } from 'reactive-core'
import { makeButton, removeEl } from './helpers'

const stopRendering = render(() => {
  // reactive stateful signals
  const [count, setCount] = createState(0)

  const incrementCount = () => setCount(count() + 1)
  const stop = () => stopRendering()

  // when the main button is clicked, count will increment
  const button = makeButton(incrementCount)
  // when the stop button is clicked, cleanup functions will be run
  const stopButton = makeButton(stop)

  // this effect will keep the main button's inner text in-sync with count
  // automatically.
  createEffect(() => (button.innerText = `Clicks: ${count()}`))

  stopButton.innerText = 'Stop Rendering'

  // this will be run when the 'stop' function (returned from the render fn) is
  // called.
  createCleanup(() => {
    // cleanup our buttons from the dom
    removeEl(button)
    removeEl(stopButton)
  })
})
