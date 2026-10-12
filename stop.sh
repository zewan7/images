#!/usr/bin/env bash
# ============================================================
# Termux 停止脚本 - 图片管理应用
# 用法: bash stop.sh
# 效果: 停止后台运行的前端(8300)和后端(8301)
# ============================================================

cd "$(dirname "$0")"

pkill -f "uvicorn app.main:app.*8301" 2>/dev/null
pkill -f "vite preview" 2>/dev/null

echo ">>> 已停止 ✅"
