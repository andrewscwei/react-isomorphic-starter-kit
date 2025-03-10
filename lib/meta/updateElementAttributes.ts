type Attribute = {
  name: string
  value?: string
  key?: boolean
}

type Options = {
  /**
   * Specifies whether the DOM element should be created if it does not already
   * exist.
   */
  autoCreate?: boolean

  /**
   * Specifies whether the DOM element should be destroyed if the value of any
   * of the specified attributes is invalid.
   */
  autoDestroy?: boolean

  /**
   * The parent node to append to the created DOM element to, if applicable.
   */
  parent?: HTMLElement
}

type Undo = () => void

/**
 * Declaratively updates the attributes of a DOM element. If `autoCreate` is
 * `true` and the element is not present it will be created and injected into
 * `parent`.
 *
 * @param tagName The tag name of the element to update.
 * @param attributes The attributes to set to.
 * @param options See {@link Options}.
 *
 * @returns A function that undoes the updates.
 */
export function updateElementAttributes(
  tagName: string,
  attributes: Attribute[],
  { autoCreate = true, autoDestroy = true, parent }: Options = {},
): Undo {
  if (typeof window === 'undefined') return () => {}

  const noop = () => {}
  const keyAttributes = attributes.filter(t => t.key === true)

  if (keyAttributes.length === 0) throw Error('Need at least one key attribute')

  const selector = keyAttributes.map(({ name, value = '' }) => `[${name}="${value}"]`).join('')
  const parentElement = parent ?? window.document.head
  const existingElement = parentElement.querySelector(`${tagName}${selector}`)
  const shouldDestroy = !attributes.every(({ value }) => !!value)

  if (shouldDestroy) {
    if (!existingElement || autoDestroy !== true) return noop

    parentElement.removeChild(existingElement)

    return () => {
      parentElement.appendChild(existingElement)
    }
  }
  else {
    if (!existingElement && autoCreate !== true) return noop

    const newElement = existingElement ?? window.document.createElement(tagName)
    const diffs: Attribute[] = []

    attributes.forEach(({ name, value = '' }) => {
      const oldVal = newElement.getAttribute(name)

      if (oldVal && oldVal !== value) diffs.push({ name, value: oldVal })
      newElement.setAttribute(name, value)
    })

    if (existingElement) {
      return () => {
        diffs.forEach(({ name, value = '' }) => existingElement.setAttribute(name, value))
      }
    }
    else {
      parentElement.appendChild(newElement)

      return () => {
        parentElement.removeChild(newElement)
      }
    }
  }
}
