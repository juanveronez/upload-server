import { expect, it } from 'vitest'
import { env } from '@/env'

it('should run with test database', () => {
  expect(env.DATABASE_URL).toBe(
    'postgresql://dokcer:docker@localhost:5432/upload_test'
  )
})
