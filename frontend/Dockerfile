# 构建阶段：使用官方 node:20（基于 Debian，稳定且存在）
FROM node:20 AS builder

# 设置工作目录
WORKDIR /app

# 复制依赖清单（仅需 package.json 和 package-lock.json）
COPY package*.json ./

# 设置 npm 镜像源为淘宝 npmmirror（国内加速）
RUN npm config set registry https://registry.npmmirror.com && \
    npm ci --only=production

# 复制源代码
COPY . .

# 执行构建（Vite 项目）
RUN npm run build

# 生产阶段：使用 nginx:alpine（体积小，阿里云拉取快）
FROM nginx:alpine

# 删除默认配置
RUN rm -f /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制你的 nginx 配置（确保监听 8300 或你指定的端口）
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口（与 nginx.conf 中 listen 一致）
EXPOSE 8300

# 启动 nginx（前台运行）
CMD ["nginx", "-g", "daemon off;"]