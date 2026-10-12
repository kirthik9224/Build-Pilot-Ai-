# Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
# Description: Multi-stage Dockerfile for BuildPilot AI Pro Vite React frontend

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
EXPOSE 80
COPY --from=builder /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
