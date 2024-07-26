type CacheOptions = {
  /**
   * The default TTL (in seconds) to use if one is not specified upon setting a
   * value.
   */
  defaultTTL?: number
}

type CacheItem<T> = {
  timestamp: number
  ttl: number
  value: T
}

type CacheAdapter = {
  getValue: <T>(key: string) => T | undefined
  invalidate: (key: string) => void
  setValue: <T>(value: T, key: string, ttl?: number) => T
}

const storage = typeof window !== 'undefined' ? window.localStorage : undefined

function invalidate(key: string) {
  storage?.removeItem(key)
}

function isStale<T>(item: CacheItem<T>): boolean {
  const { timestamp, ttl } = item

  return (Date.now() - timestamp) / 1000 >= ttl
}

function getValue<T>(key: string): T | undefined {
  const res = storage?.getItem(key)
  if (!res) return undefined

  const item = JSON.parse(res) as CacheItem<T>
  if (!item) return undefined

  if (isStale(item)) {
    invalidate(key)

    return undefined
  }
  else {
    return item.value
  }
}

function setValue<T>(value: T, key: string, ttl: number): T {
  const item = {
    value,
    timestamp: Date.now(),
    ttl,
  }

  storage?.setItem(key, JSON.stringify(item))

  return value
}

/**
 * Returns a simple caching interface for getting, setting and invalidating a
 * value from the browser's session storage.
 *
 * @param options See {@link CacheOptions}.
 *
 * @returns The interface.
 */
export function createLocalCache({ defaultTTL = 300 }: CacheOptions = {}): CacheAdapter {
  return {
    getValue,
    invalidate,
    setValue: <T>(val: T, key: string, ttl = defaultTTL) => setValue<T>(val, key, ttl),
  }
}
