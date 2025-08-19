# Etapa de build
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa de producción
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html


EXPOSE 80
