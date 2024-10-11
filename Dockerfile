FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# COPY .env.production.local .env

RUN npm run prisma:generate

RUN npm run build

EXPOSE 3000

CMD [ "sh", "-c", "npm run prisma:migrate && npm run start:prod" ]
