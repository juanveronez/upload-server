import { parse } from 'node:path'
import { uuidv7 } from 'uuidv7'

export function generateUniqueFileName(fileName: string) {
  const { name, ext } = parse(fileName)

  const sanitizedFileName = name.replace(/[^a-zA-Z0-9]/g, '')
  const sanitizedFileNameWithExtension = sanitizedFileName.concat(ext)

  return `${uuidv7()}-${sanitizedFileNameWithExtension}`
}
