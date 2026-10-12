#!/usr/bin/env bash
# ============================================================
# Termux 一键部署脚本 - 图片管理应用
# 用法:
#   bash termux_deploy.sh                          # 默认 Python(官方最新版)
#   PYTHON_PKG=python311 bash termux_deploy.sh     # 指定其他 Python 包
# 效果: 安装依赖 -> 配置 .env -> 启动后端(8301) + 前端(8300)
# ============================================================
set -e

# ------------------------------------------------------------
# Python 版本选择
#   默认官方 python 包(当前 3.14.x,跟随上游)
#   想用其他版本: PYTHON_PKG=<包名> 启动脚本
#     例: PYTHON_PKG=python311  (若你的 pkg 源提供该包)
#     例: PYTHON_PKG=python3.11
#   若包不存在,脚本自动回退官方 python 并警告
# ------------------------------------------------------------
PYTHON_PKG="${PYTHON_PKG:-python}"
case "$PYTHON_PKG" in
  python)    PY="python" ;;
  python311) PY="python311" ;;
  python3.11) PY="python3.11" ;;
  python312) PY="python312" ;;
  python3.12) PY="python3.12" ;;
  python313) PY="python313" ;;
  python3.13) PY="python3.13" ;;
  *)         PY="python" ;;
esac

echo "========================================"
echo "  Termux 部署图片管理应用"
echo "  Python 包: $PYTHON_PKG -> 命令: $PY"
echo "========================================"

# 1. 基础包
echo ">>> [1/5] 安装系统依赖..."
pkg update -y || true

# 先单独装指定 Python 包,不存在则回退官方 python
if ! pkg install -y "$PYTHON_PKG"; then
  echo ">>> 警告: 包 $PYTHON_PKG 不存在,回退官方 python (当前 3.14.x)"
  PYTHON_PKG="python"
  PY="python"
  pkg install -y "$PYTHON_PKG"
fi

if [ "$PYTHON_PKG" = "python" ]; then
  # 官方 python: 装 Termux 预编译的扩展包,省去现场编译
  pkg install -y nodejs-lts redis binutils clang rust python-pillow python-cryptography python-bcrypt
else
  # 自定义 Python 版本: 官方预编译包不匹配,改为 pip 编译安装(clang/rust 兜底)
  pkg install -y nodejs-lts redis binutils clang rust
fi

# 2. 后端依赖
cd "$(dirname "$0")/backend"
echo ">>> [2/5] 安装后端 Python 依赖 ($PY)..."
# Python 3.14 需 Pillow 11.3+，若 requirements.txt 里钉了旧版 Pillow，此处强制升级
if "$PY" -c 'import sys; exit(0 if sys.version_info >= (3, 13) else 1)' 2>/dev/null; then
  echo ">>> 检测到 Python >= 3.13，先升级 Pillow 以兼容"
  "$PY" -m pip install --upgrade "Pillow>=11.3"
fi
"$PY" -m pip install -r requirements.txt

# 3. 配置 .env
if [ ! -f .env ]; then
  echo ">>> [3/5] 生成 .env (默认: 内存验证码 + 控制台邮件 + SQLite)..."
  cp .env.example .env
  # 关键项
  sed -i 's/^APP_PORT=.*/APP_PORT=8301/' .env
  sed -i 's/^IMAGE_BASE_URL=.*/IMAGE_BASE_URL=http:\/\/localhost:8301\/images/' .env
  sed -i 's/^SECRET_KEY=.*/SECRET_KEY='"$("$PY" -c 'import secrets; print(secrets.token_hex(32))')"'/' .env
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
"$PY" -m uvicorn app.main:app --host 0.0.0.0 --port 8301
