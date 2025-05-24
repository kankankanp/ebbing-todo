# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# 必要なパッケージをインストール
RUN apk add --no-cache openssl3

COPY package*.json ./

RUN npm install

COPY . .

# Prismaクライアントを生成
RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "start:dev"]