import fs from 'fs'

/**
 * Reads an asset manifest file from the file system and returns it as a JS
 * object.
 *
 * @param file File path of asset manifest file.
 *
 * @returns JS object of the asset manifest or an empty object if an error is
 *          thrown.
 */
export function getAssetManifest(file: string): Record<string, string> {
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
