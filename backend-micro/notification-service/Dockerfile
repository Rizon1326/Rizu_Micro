# Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 5004
CMD ["npm", "start"]
