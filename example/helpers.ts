export const removeEl = (e: HTMLElement) => e.parentElement?.removeChild(e)

export const makeButton = (onClick: (el: HTMLButtonElement) => void) => {
  const button = document.createElement('button')
  button.style.cssText = `
  display: block;
  position: relative;
  margin: 10px;
  padding: 12px;
  `
  document.body.appendChild(button)
  button.addEventListener('click', () => onClick(button))
  return button
}
