import { randomUUID } from 'node:crypto'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod/v4'

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: 'Upload an image',
        consumes: ['multipart/form-data'],
        response: {
          201: z.object({ uploadId: z.uuidv7() }),
          409: z
            .object({ message: z.string() })
            .describe('Upload already exists.'),
        },
      },
    },
    async (request, reply) => {
      const TWO_MEGABYTES = 1024 * 1024 * 2

      const uploadedMultipart = await request.file({
        limits: { fileSize: TWO_MEGABYTES },
      })

      console.log(uploadedMultipart)

      return reply.status(201).send({ uploadId: randomUUID() })
    }
  )
}
