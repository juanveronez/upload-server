import { randomUUID } from 'node:crypto'
import { describe, expect, it, vi } from 'vitest'
import { isRight, unwrapEither } from '@/infra/shared/either'
import * as upload from '@/infra/storage/upload-file-to-storage'
import { makeUpload } from '@/test/factories/make-upload'
import { exportUploads } from './export-uploads'

describe('export uploads', () => {
  it('should be able to export uploads', async () => {
    const namePattern = randomUUID()

    const uploadStub = vi
      .spyOn(upload, 'uploadFileToStorage')
      .mockImplementationOnce(async () => ({
        key: `downloads/${namePattern}.csv`,
        url: `https://exemple.com/downloads/${namePattern}.csv`,
      }))

    const upload1 = await makeUpload({ name: `${namePattern}1.webp` })
    const upload2 = await makeUpload({ name: `${namePattern}2.webp` })
    const upload3 = await makeUpload({ name: `${namePattern}3.webp` })
    const upload4 = await makeUpload({ name: `${namePattern}4.webp` })
    const upload5 = await makeUpload({ name: `${namePattern}5.webp` })

    const sut = await exportUploads({
      searchQuery: namePattern,
    })

    const firstUploadCall = uploadStub.mock.calls[0]
    const firstUploadParam = firstUploadCall[0]
    const generatedCSVStream = firstUploadParam.contentStream

    const csvAsString = await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = []

      generatedCSVStream.on('data', (chunk: Buffer) => chunks.push(chunk))

      generatedCSVStream.on('end', () =>
        resolve(Buffer.concat(chunks).toString('utf-8'))
      )

      generatedCSVStream.on('error', err => reject(err))
    })

    const csvAsArray = csvAsString
      .trim()
      .split('\n')
      .map(line => line.split(','))

    expect(isRight(sut)).toBeTruthy()
    expect(unwrapEither(sut)).toEqual({
      reportUrl: `https://exemple.com/downloads/${namePattern}.csv`,
    })
    expect(csvAsArray).toEqual([
      ['ID', 'Name', 'URL', 'Uploaded at'],
      [upload1.id, upload1.name, upload1.remoteUrl, expect.any(String)],
      [upload2.id, upload2.name, upload2.remoteUrl, expect.any(String)],
      [upload3.id, upload3.name, upload3.remoteUrl, expect.any(String)],
      [upload4.id, upload4.name, upload4.remoteUrl, expect.any(String)],
      [upload5.id, upload5.name, upload5.remoteUrl, expect.any(String)],
    ])
  })
})
