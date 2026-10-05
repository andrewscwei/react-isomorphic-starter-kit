import { type RenderContext } from '../types/RenderContext.js'

/**
 * Sets a field of the local data object to bootstrap into the edge-rendered
 * page.
 *
 * @param context See {@link RenderContext}.
 * @param key The field key.
 * @param value The field value.
 */
export function setLocalData<K extends keyof LocalData>(context: RenderContext, key: K, value: LocalData[K]) {
  context.localData[key] = value
}
