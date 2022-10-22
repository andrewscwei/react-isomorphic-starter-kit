import fs from 'fs'
import path from 'path'

export default function getEntriesFromDir(dir: string, baseDir: string = dir): string[] {
  const files = fs.readdirSync(dir)
  const entries: string[] = []

  for (const fileName of files) {
    const filePath = path.join(dir, fileName)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      entries.push(...getEntriesFromDir(filePath, dir))
    }
    else if (!(/(^|\/)\.[^/.]/g).test(fileName)) {
      entries.push(path.relative(baseDir, filePath))
    }
  }

  return entries
}
