## Uso do Zod no Fastify

O Zod pode ser utilizado no Fastify para:
- Validação dos dados que chegam no servidor
- Serializar os dados que saem do servidor

Fluxo de dados:
---> Input (Validação)
<--- Output (Serialização)

Dessa forma o zod controla tanto o formato das entradas como das saídas de dados.

Para isso usamod o `fastify-type-provider-zod` que é um plugin que integra o Zod com o Fastify, depois configuramos o Fastify para usar o zod como compiler de validação e serialização. Para isso usamos:
```ts
const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)
```

## Default Error Handler - Fastify

Um Default Error Handler é uma função que é executada quando ocorre um erro não tratado, sendo assim uma última camada de tratamento de erros.
No Fastify podemos configurar o Default Error Handler através do método `setErrorHandler` do servidor.
Sendo que quando utilizamos o Fastify com Zod é interessante que o Default Error Handler trate os erros de validação do Zod de forma adequada, retornando uma resposta com o status 400 e uma mensagem tratada.

Além disso, é nessa camada da aplicação que podemos tratar erros inesperados e monitorar erros que ocorrem na aplicação com ferramentas como Sentry, etc.

```ts
server.setErrorHandler((error, _request, reply) => {
  // verify if it's a zod validation error
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: 'Validation Error',
      issues: error.validation,
    })
  }

  // send error to external tool
  console.error(error)

  return reply.status(500).send({ message: 'Internal server error.' })
})
```

**É recomendado que em caso de erro 500 não seja retornado o erro original, pois isso pode expor informações sensíveis da aplicação. Em vez disso, é melhor retornar uma mensagem genérica de erro.**
