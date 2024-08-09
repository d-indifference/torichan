FROM node:21-bullseye-slim

WORKDIR /app

COPY . .

RUN npm i -g gifsicle
RUN npm i

RUN npm run build
RUN npm run prisma:generate

RUN mkdir -p /app/public/files
RUN mkdir -p /app/volumes
RUN mkdir -p /app/volumes/torichan

CMD ["npm", "run", "start:prod"]