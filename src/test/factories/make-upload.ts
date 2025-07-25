import { fakerPT_BR as faker } from '@faker-js/faker'
import type { InferInsertModel } from 'drizzle-orm'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

export async function makeUpload(
  overrides?: Partial<InferInsertModel<typeof schema.uploads>>
) {
  const name = faker.system.fileName()
  const remoteKey = `images/${name}`

  const baseUrl = faker.internet.url({ appendSlash: false })
  const remoteUrl = `${baseUrl}/${remoteKey}`

  const [result] = await db
    .insert(schema.uploads)
    .values({ name, remoteKey, remoteUrl, ...overrides })
    .returning()

  return result
}
