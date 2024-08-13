FROM node:14


WORKDIR /app


COPY package*.json ./


RUN npm install

COPY frontend /app/frontend
COPY backend /app/backend

EXPOSE 3000

CMD ["node", "backend/server.js"]
