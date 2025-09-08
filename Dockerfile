FROM node:20.18

RUN npm i -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm i

COPY . .

EXPOSE 3333

CMD ["pnpm", "dev"]
