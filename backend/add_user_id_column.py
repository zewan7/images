import sys
import os

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from app.database import engine

def main():
    try:
        with engine.connect() as conn:
            # 检查images表是否存在
            result = conn.execute(text("SHOW TABLES LIKE 'images'"))
            if not result.fetchone():
                print("images表不存在，将创建新表")
                # 创建新表会自动包含user_id列
                from app.models import image, user
                from app.database import Base
                Base.metadata.create_all(bind=engine)
                print("表创建成功")
                return
            
            # 检查user_id列是否存在
            result = conn.execute(text("SHOW COLUMNS FROM images LIKE 'user_id'"))
            if not result.fetchone():
                print("user_id列不存在，将添加该列")
                # 添加user_id列
                conn.execute(text("ALTER TABLE images ADD COLUMN user_id INT NOT NULL DEFAULT 1"))
                # 添加外键约束
                conn.execute(text("ALTER TABLE images ADD CONSTRAINT fk_images_user FOREIGN KEY (user_id) REFERENCES users(id)"))
                conn.commit()
                print("user_id列添加成功")
            else:
                print("user_id列已经存在")
    except Exception as e:
        print(f"错误: {e}")

if __name__ == "__main__":
    main()