# 给已迁移/已有的 users 表添加 is_public 列（图片共享开关）
# 用法（手机 Termux backend/ 目录下执行）:
#   python add_is_public_column.py
import sqlite3
import os

DB = 'images.db'

def main():
    if not os.path.exists(DB):
        print(f"❌ 找不到数据库文件 {DB}，请确认在 backend/ 目录下执行")
        return

    db = sqlite3.connect(DB)
    try:
        # 检查是否已有 is_public 列
        cols = [row[1] for row in db.execute("PRAGMA table_info(users)").fetchall()]
        if 'is_public' in cols:
            print("✅ users 表已有 is_public 列，无需修改")
        else:
            # 添加列，默认 True（公开），老用户全部公开
            db.execute("ALTER TABLE users ADD COLUMN is_public BOOLEAN DEFAULT 1")
            db.commit()
            print("✅ 已添加 is_public 列（默认公开=True），老用户图片默认全部可见")
        # 验证
        rows = db.execute("SELECT id, username, is_public FROM users LIMIT 5").fetchall()
        print("当前用户共享状态:", rows)
    finally:
        db.close()

if __name__ == "__main__":
    main()
