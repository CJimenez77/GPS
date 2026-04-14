FROM node:18-alpine

WORKDIR /app

COPY microservices/ms-requirements/package*.json microservices/ms-requirements/tsconfig.json microservices/ms-requirements/drizzle.config.ts ./
COPY microservices/ms-requirements/src ./src

COPY frontend/dist ./frontend/dist

RUN cd microservices/ms-requirements && npm install && npm run build

EXPOSE 3001

CMD ["node", "dist/index.js"]