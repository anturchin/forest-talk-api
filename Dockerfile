FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

COPY .env.production.local .env

RUN npm prisma:generate

RUN npm run build

EXPOSE 3000

CMD [ "sh", "-c", "npm prisma:migrate && npm run start:prod" ]
