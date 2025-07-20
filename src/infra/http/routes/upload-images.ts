import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod/v4'
import { uploadImage } from '@/app/functions/upload-image'
import { isRight, unwrapEither } from '@/infra/shared/either'

export const uploadImageRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: 'Upload an image',
        consumes: ['multipart/form-data'],
        response: {
          201: z.object({ url: z.url() }).describe('Image uploaded'),
          400: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const TWO_MEGABYTES = 1024 * 1024 * 2

      const uploadedFile = await request.file({
        limits: { fileSize: TWO_MEGABYTES },
      })

      if (!uploadedFile)
        return reply.status(400).send({ message: 'File is required' })

      const result = await uploadImage({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file,
      })

      if (isRight(result)) {
        const { url } = unwrapEither(result)
        return reply.status(201).send({ url })
      }

      const error = unwrapEither(result)

      switch (error.name) {
        case 'InvalidFileFormat':
          return reply.status(400).send({ message: error.message })
      }
    }
  )
}
