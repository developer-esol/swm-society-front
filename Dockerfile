# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build-time env vars (Vite bakes these in at build time)
ARG VITE_API_BASE=http://178.128.92.125:4001
ARG VITE_AUTH_BASE=http://178.128.92.125:8081
ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_AUTH_BASE=$VITE_AUTH_BASE

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# nginx config for SPA (React Router support)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
