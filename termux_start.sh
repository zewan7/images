#!/usr/bin/env bash
# ============================================================
# Termux 部署后的启动脚本（服务停止后可快速重启）
# 用法: bash termux_start.sh
# Python 命令默认 python；如需其他版本，如 PY=python311 bash termux_start.sh
# ============================================================
PY="${PY:-python}"
cd "$(dirname "$0")"

echo ">>> 启动后端 (8301, Python=$PY)..."
cd backend
"$PY" -m uvicorn app.main:app --host 0.0.0.0 --port 8301 &
BACKEND_PID=$!
cd ..

echo ">>> 启动前端 (8300)..."
cd frontend
npm run preview -- --host &
FRONTEND_PID=$!
cd ..

echo "后端 PID: $BACKEND_PID  前端 PID: $FRONTEND_PID"
echo "访问: http://localhost:8300"
echo "按 Ctrl+C 同时停止前后端..."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
