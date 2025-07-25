import { Readable } from 'node:stream'
import { Upload } from '@aws-sdk/lib-storage'
import z from 'zod'
import { env } from '@/env'
import { generateUniqueFileName } from '../utils/generateUniqueFileName'
import { r2 } from './client'

const uploadFileToStorageInput = z.object({
  folder: z.enum(['images', 'downloads']),
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
})

type UploadFileToStorageInput = z.input<typeof uploadFileToStorageInput>

export async function uploadFileToStorage(input: UploadFileToStorageInput) {
  const { folder, fileName, contentType, contentStream } =
    uploadFileToStorageInput.parse(input)

  const uniqueFileName = generateUniqueFileName(fileName)
  const key = `${folder}/${uniqueFileName}`

  const filePublicUrl = new URL(key, env.CLOUDFLARE_PUBLIC_URL).toString()

  const upload = new Upload({
    client: r2,
    params: {
      Bucket: env.CLOUDFLARE_BUCKET,
      Key: key,
      Body: contentStream,
      ContentType: contentType,
    },
  })

  await upload.done()

  return {
    key,
    url: filePublicUrl,
  }
}
