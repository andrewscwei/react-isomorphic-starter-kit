export default function getTranslations() {
  const translations: Record<string, any> = {}

  try {
    const req = require.context('../../ui/locales/', true, /^.*\.json$/)

    for (const key of req.keys()) {
      const phrases = req(key)
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
