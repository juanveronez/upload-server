import { randomUUID } from 'node:crypto'
import { describe, it } from 'vitest'
import { makeUpload } from '@/test/factories/make-upload'
import { exportUploads } from './export-uploads'

describe('export uploads', () => {
  it('should be able to export uploads', async () => {
    const namePattern = randomUUID()

    const upload1 = await makeUpload({ name: `${namePattern}1.webp` })
    const upload2 = await makeUpload({ name: `${namePattern}2.webp` })
    const upload3 = await makeUpload({ name: `${namePattern}3.webp` })
    const upload4 = await makeUpload({ name: `${namePattern}4.webp` })
    const upload5 = await makeUpload({ name: `${namePattern}5.webp` })

    const sut = await exportUploads({
      searchQuery: namePattern,
    })
  })
})
