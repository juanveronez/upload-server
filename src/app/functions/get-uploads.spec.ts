import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { makeUpload } from '@/test/factories/make-upload'
import { unwrapEither } from './../../infra/shared/either'
import { isRight } from '../../infra/shared/either'
import { getUploads } from './get-uploads'

describe('get uploads', () => {
  it('should be able to get uploads', async () => {
    const namePattern = randomUUID()

    const upload1 = await makeUpload({ name: `${namePattern}1.webp` })
    const upload2 = await makeUpload({ name: `${namePattern}2.webp` })
    const upload3 = await makeUpload({ name: `${namePattern}3.webp` })
    const upload4 = await makeUpload({ name: `${namePattern}4.webp` })
    const upload5 = await makeUpload({ name: `${namePattern}5.webp` })

    const sut = await getUploads({
      searchQuery: namePattern,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toBe(5)
    expect(unwrapEither(sut).content).toHaveLength(5)
    expect(unwrapEither(sut).content).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ])
  })

  it('should be able to get paginated uploads', async () => {
    const namePattern = randomUUID()

    const upload1 = await makeUpload({ name: `${namePattern}1.webp` })
    const upload2 = await makeUpload({ name: `${namePattern}2.webp` })
    const upload3 = await makeUpload({ name: `${namePattern}3.webp` })
    const upload4 = await makeUpload({ name: `${namePattern}4.webp` })
    const upload5 = await makeUpload({ name: `${namePattern}5.webp` })

    let sut = await getUploads({
      searchQuery: namePattern,
      page: 1,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toBe(5)
    expect(unwrapEither(sut).content).toHaveLength(3)
    expect(unwrapEither(sut).content).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
    ])

    sut = await getUploads({
      searchQuery: namePattern,
      page: 2,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toBe(5)
    expect(unwrapEither(sut).content).toHaveLength(2)
    expect(unwrapEither(sut).content).toEqual([
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ])
  })

  it('should be able to get sorted uploads', async () => {
    const namePattern = randomUUID()

    const upload1 = await makeUpload({
      name: `${namePattern}1.webp`,
      createdAt: dayjs().toDate(),
    })
    const upload2 = await makeUpload({
      name: `${namePattern}2.webp`,
      createdAt: dayjs().subtract(1, 'days').toDate(),
    })
    const upload3 = await makeUpload({
      name: `${namePattern}3.webp`,
      createdAt: dayjs().subtract(2, 'days').toDate(),
    })
    const upload4 = await makeUpload({
      name: `${namePattern}4.webp`,
      createdAt: dayjs().subtract(3, 'days').toDate(),
    })
    const upload5 = await makeUpload({
      name: `${namePattern}5.webp`,
      createdAt: dayjs().subtract(4, 'days').toDate(),
    })

    let sut = await getUploads({
      searchQuery: namePattern,
      sortBy: 'createdAt',
      sortDirection: 'asc',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toBe(5)
    expect(unwrapEither(sut).content).toHaveLength(5)
    expect(unwrapEither(sut).content).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ])

    sut = await getUploads({
      searchQuery: namePattern,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toBe(5)
    expect(unwrapEither(sut).content).toHaveLength(5)
    expect(unwrapEither(sut).content).toEqual([
      expect.objectContaining({ id: upload1.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload5.id }),
    ])
  })
})
