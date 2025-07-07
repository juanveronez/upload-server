# API com Zod e Fastify

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

# Documentação com Swagger

A documentação de uma API é importante para que outros desenvolvedores saibam o que foi desenvolvido, além disso o Swagger pode ser usado para testar a API de forma interativa, o que facilita o desenvolvimento e testes.

No Fastify podemos usar o plugin `@fastify/swagger` para gerar a documentação da API de forma automática, além disso podemos usar o plugin `@fastify/swagger-ui` para criar uma interface gráfica para a documentação.

Também podemos usar o Zod para definição dos schemas de validação e serialização que será exibido na documentação ao invés da definição por JSON Schema. Para isso na definição do registro do swagger usamos o transform jsonSchemaTransform do Zod, que transforma os schemas do Zod em JSON Schema, que é o formato utilizado pelo Swagger.

```ts
server.register(fastifyMultipart)
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Upload Server',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})
server.register(fastifySwaggerUi, { routePrefix: '/docs' })
```

Nesta aplicação também foi usado o plugin `@fastify/multipart` para lidar com multipart/form-data, que é o tipo de dado usado para upload de arquivos. Este plugin permite que o Fastify trate requisições com esse tipo de dado de forma eficiente.

# Database e Drizzle ORM

O Drizzle ORM é um ORM que permite trabalhar com bancos de dados. Foi escolhido por ser melhor para queries mais complexas e por mantar a tipagem do TypeScript mesmo mesmo com queries mais complexas.

Além disso tem um formato de definição de schemas diferente do Prisma, que usa arquivos `.ts`.

Este ORM é muito mais próximo do SQL puro, sendo quase um query builder, mas com a vantagem de manter a tipagem do TypeScript.

## Campos de data com ou sem timezone?

Quando lidamos com campos de data no banco de dados podemos optar por usar campos com ou sem timezone.
O campo **sem timezone** é recomendado para quando a informação de data não será muito utilizada pela aplicação, como por exemplo quando a data é apenas um registro de criação ou atualização de um recurso.
Já o campo **com timezone** é recomendado para quando a data será utilizada para comparações dentro da aplicação, como em casos de agendamento de eventos, por exemplo.
