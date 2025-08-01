/**
 * Type definition of a mutable object whose content is populated at render
 * time.
 */
export type RenderContext = {
  /**
   * Metadata to inject into rendered HTML.
   */
  metadata: Record<string, any>

  /**
   * Data to bootstrap into rendered HTML as `window.__localData`.
   */
  localData: Record<string, any>
}

export namespace RenderContext {
  /**
   * Creates a new render context.
   *
   * @returns The new render context.
   */
  export function factory(): RenderContext {
    return {
      metadata: {},
      localData: {},
    }
  }
}
