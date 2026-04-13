FROM node:18-alpine

WORKDIR /app

COPY package*.json tsconfig.json drizzle.config.ts ./
COPY src ./src

RUN npm install && \
    npm run build

EXPOSE 3001

CMD ["node", "dist/index.js"]