#!/usr/bin/env bash
# ============================================================
# Termux 后台启动脚本 - 图片管理应用
# 用法: bash start.sh
# 效果: 后端(8301) + 前端(8300) 全部后台运行，脚本立即返回
#       可随时关闭 Termux 终端窗口，服务继续运行
# Python 命令默认 python；如需其他版本: PY=python311 bash start.sh
# ============================================================
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
PY="${PY:-python}"
LOG_DIR="$ROOT/logs"
mkdir -p "$LOG_DIR"

# 已在运行则提示
if pgrep -f "uvicorn app.main:app.*8301" >/dev/null 2>&1; then
  echo ">>> 服务已在运行，如需重启请先: bash stop.sh"
  exit 1
fi

echo ">>> 后台启动后端 (8301, Python=$PY)..."
cd "$ROOT/backend"
# 后台运行并脱离终端会话，关闭 Termux 窗口后服务继续存活
setsid "$PY" -m uvicorn app.main:app --host 0.0.0.0 --port 8301 \
  >>"$LOG_DIR/backend.log" 2>&1 < /dev/null &

echo ">>> 后台启动前端 (8300)..."
cd "$ROOT/frontend"
setsid npm run preview -- --host \
  >>"$LOG_DIR/frontend.log" 2>&1 < /dev/null &

sleep 4  # 等待进程稳定，避免立刻误判

if pgrep -f "uvicorn app.main:app.*8301" >/dev/null 2>&1; then
  echo ">>> 启动完成 ✅"
  echo "    访问: http://localhost:8300"
  echo "    日志: $LOG_DIR/backend.log, $LOG_DIR/frontend.log"
  echo "    停止: bash stop.sh"
else
  echo ">>> 启动失败，请查看日志:"
  echo "    $LOG_DIR/backend.log"
  echo "    $LOG_DIR/frontend.log"
fi
