import fs from 'fs'

export default function getAssetManifest(file: string): Record<string, string> {
  try {
    const manifest = fs.readFileSync(file, 'utf-8')
    const json = JSON.parse(manifest)

    // eslint-disable-next-line no-console
    console.log(`Reading asset manifest file <${file}>...`, 'OK')

    return json
  }
  catch (err) {
    console.warn(`Reading asset manifest file <${file}>...`, 'SKIP', 'No asset manifest file found')

    return {}
  }
}
