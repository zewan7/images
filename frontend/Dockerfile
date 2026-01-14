FROM node:20-bookworm AS builder
WORKDIR /app

COPY package*.json .
RUN npm config set registry https://registry.npmmirror.com && npm install

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8300
CMD ["nginx", "-g", "daemon off;"]