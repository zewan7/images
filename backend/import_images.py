from PIL import Image
import os
import random
from datetime import datetime
from app.models.image import Image as DBImage
from app.models.user import User
from app.database import SessionLocal
from config.settings import settings

# 简单的 AI 生成标题和说明的函数
def generate_ai_title(filename):
    """生成 AI 标题"""
    adjectives = ["美丽的", "精彩的", "独特的", "迷人的", "壮观的", "精致的", "生动的", "绚丽的"]
    nouns = ["风景", "建筑", "人物", "动物", "植物", "艺术", "自然", "生活"]
    return f"{random.choice(adjectives)} {random.choice(nouns)} - {os.path.splitext(filename)[0]}"

def generate_ai_description(width, height):
    """生成 AI 描述"""
    descriptions = [
        f"这是一张分辨率为 {width}x{height} 的精美图片，展示了令人惊叹的视觉效果。",
        f"这张 {width}x{height} 的图片捕捉了精彩瞬间，展现了独特的艺术魅力。",
        f"分辨率 {width}x{height} 的高质量图片，包含丰富的细节和生动的色彩。",
        f"这张图片尺寸为 {width}x{height}，呈现了壮观的景象和细腻的纹理。"
    ]
    return random.choice(descriptions)

# 主函数
def main():
    # 图片目录
    image_dir = settings.IMAGE_UPLOAD_DIR
    # 确保目录存在
    os.makedirs(image_dir, exist_ok=True)
    
    # 创建数据库会话
    db = SessionLocal()
    
    try:
        # 递归遍历图片目录及其子目录
        for root, dirs, files in os.walk(image_dir):
            for filename in files:
                # 过滤图片文件
                if filename.lower().endswith((".jpg", ".jpeg", ".png", ".gif")):
                    # 获取文件路径
                    filepath = os.path.join(root, filename)
                    
                    # 检查文件是否已存在于数据库
                    existing_image = db.query(DBImage).filter(DBImage.filepath == filepath).first()
                    if existing_image:
                        print(f"图片 {filepath} 已存在于数据库中，跳过")
                        continue
                    
                    # 打开图片获取尺寸
                    with Image.open(filepath) as img:
                        width, height = img.size
                    
                    # 生成 AI 标题和说明
                    title = generate_ai_title(filename)
                    description = generate_ai_description(width, height)
                    
                    # 创建 Image 对象
                    image = DBImage(
                        title=title,
                        description=description,
                        filename=filename,
                        filepath=filepath,
                        width=width,
                        height=height,
                        user_id=3  # 归属于 user_id=3
                    )
                    
                    # 添加到数据库
                    db.add(image)
                    print(f"成功导入图片: {filepath} -> {title}")
        
        # 提交事务
        db.commit()
        print("\n所有图片导入完成！")
        
    except Exception as e:
        # 回滚事务
        db.rollback()
        print(f"导入过程中发生错误: {str(e)}")
    finally:
        # 关闭数据库会话
        db.close()

if __name__ == "__main__":
    main()
