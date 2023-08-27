type Attribute = {
  name: string
  value: string
  key?: boolean
}

type Options = {
  parent?: Node
  autoCreate?: boolean
}

type Undo = () => void

/**
 * Declaratively updates the attributes of an element. If `options.autoCreate`
 * is `true`, if the element is not present it will be created and injected into
 * `options.parent`.
 *
 * @param tagName - The tag name of the element to update.
 * @param attributes - The attributes to set to.
 * @param options - See {@link Options}.
 *
 * @returns A function that undoes the updates.
 */
export function updateElementAttributes(tagName: string, attributes: Attribute[], { parent, autoCreate = true }: Options = {}): Undo {
  if (typeof document === 'undefined') return () => {}

  const keyAttributes = attributes.filter(t => t.key === true)
  if (keyAttributes.length === 0) throw Error('Missing key attribute(s)')

  const oldElement = document.querySelector(`${tagName}${keyAttributes.map(({ name, value }) => `[${name}="${value}"]`).join('')}`)
  if (!oldElement && autoCreate !== true) return () => {}

  const newElement = oldElement ?? document.createElement(tagName)
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
    const parentElement = parent ?? document.body

    parentElement.appendChild(newElement)

    return () => {
      parentElement.removeChild(newElement)
    }
  }
}
