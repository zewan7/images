#FROM node as builder
FROM node:20-alpine AS builder
# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json .

# 安装依赖，使用国内镜像
RUN npm config set registry https://registry.npmmirror.com && npm install

# 复制源代码
COPY . .

# 构建生产版本
RUN npm run build

# 使用nginx作为生产服务器
FROM nginx:alpine

# 复制构建好的文件到nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 3000

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
