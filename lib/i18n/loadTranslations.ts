export default function loadTranslations(ctx: __WebpackModuleApi.RequireContext): Record<string, any> {
  const translations: Record<string, any> = {}

  try {
    for (const key of ctx.keys()) {
      const phrases = ctx(key)
      const parts = key.replace('./', '').split('/')

      let t = translations

      for (const part of parts) {
        const subkey = part.replace('.json', '')
        t[subkey] = part.endsWith('.json') ? phrases : {}
        t = t[subkey]
      }
    }
  }
  catch (err) {
    console.error('Loading translations...', 'ERR', err)
  }

  return translations
}
