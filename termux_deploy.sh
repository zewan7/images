#!/usr/bin/env bash
# ============================================================
# Termux 一键部署脚本 - 图片管理应用
# 用法: bash termux_deploy.sh
# 效果: 安装依赖 -> 配置 .env -> 启动后端(8301) + 前端(8300)
# ============================================================
set -e

echo "========================================"
echo "  Termux 部署图片管理应用"
echo "========================================"

# 1. 基础包
echo ">>> [1/5] 安装系统依赖 (python/nodejs/redis)..."
pkg update -y || true
pkg install -y python nodejs-lts redis binutils clang rust python-pillow python-cryptography python-bcrypt

# 2. 后端依赖
cd "$(dirname "$0")/backend"
echo ">>> [2/5] 安装后端 Python 依赖..."
pip install -r requirements.txt

# 3. 配置 .env
if [ ! -f .env ]; then
  echo ">>> [3/5] 生成 .env (默认: 内存验证码 + 控制台邮件 + SQLite)..."
  cp .env.example .env
  # 关键项
  sed -i 's/^APP_PORT=.*/APP_PORT=8301/' .env
  sed -i 's/^IMAGE_BASE_URL=.*/IMAGE_BASE_URL=http:\/\/localhost:8301\/images/' .env
  sed -i 's/^SECRET_KEY=.*/SECRET_KEY='"$(python -c 'import secrets; print(secrets.token_hex(32))')"'/' .env
else
  echo ">>> [3/5] .env 已存在, 跳过生成"
fi

# 4. 前端依赖
cd ../frontend
echo ">>> [4/5] 安装前端依赖并构建..."
npm install
npm run build

# 5. 启动服务
cd ../backend
echo ">>> [5/5] 启动服务..."
echo "后端: http://localhost:8301/docs  (Ctrl+C 停止)"
echo "前端: 运行下面命令 (另开一个终端):"
echo "      cd $PWD/../frontend && npm run preview -- --host"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8301
