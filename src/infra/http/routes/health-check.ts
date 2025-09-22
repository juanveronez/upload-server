import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod/v4'

export const healthCheckRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    '/health',
    {
      schema: {
        summary: 'Health Check',
        response: {
          200: z
            .object({
              application: z.string(),
              database: z.string(),
              bucket: z.string(),
            })
            .describe('health check response'),
        },
      },
    },
    async (_request, reply) => {
      return reply
        .status(200)
        .send({ application: 'Ok', database: 'Unknown', bucket: 'Unknown' })
    }
  )
}
