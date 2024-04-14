type Attribute = {
  name: string
  value: string
  key?: boolean
}

type Options = {
  /**
   * Speicifies whether the DOM element should be created if it does not already
   * exist.
   */
  autoCreate?: boolean

  /**
   * The parent node to appened the created DOM element to, if applicable.
   */
  parent?: Node
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
export function updateElementAttributes(tagName: string | undefined, attributes: Attribute[], { parent, autoCreate = true }: Options = {}): Undo {
  if (typeof window === 'undefined' || !tagName) return () => {}

  const keyAttributes = attributes.filter(t => t.key === true)
  if (keyAttributes.length === 0) throw Error('Missing key attribute(s)')

  const keyAttributesSelector = keyAttributes.map(({ name, value }) => `[${name}="${value}"]`).join('')
  const oldElement = window.document.querySelector(`${tagName}${keyAttributesSelector}`)
  if (!oldElement && autoCreate !== true) return () => {}

  const newElement = oldElement ?? window.document.createElement(tagName)
  const diffs: Attribute[] = []

  attributes.forEach(({ name, value }) => {
    const oldVal = newElement.getAttribute(name)

    if (oldVal && oldVal !== value) diffs.push({ name, value: oldVal })
    newElement.setAttribute(name, value)
  })

  if (oldElement) {
    return () => {
      diffs.forEach(({ name, value }) => oldElement.setAttribute(name, value))
    }
  }
  else {
    const parentElement = parent ?? window.document.body

    parentElement.appendChild(newElement)

    return () => {
      parentElement.removeChild(newElement)
    }
  }
}
