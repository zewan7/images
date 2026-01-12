import os
from PIL import Image

# 配置
THUMBNAIL_SIZE = (500, 500)  # 提高缩略图尺寸，减少模糊
THUMBNAIL_QUALITY = 95  # 提高缩略图质量
ORIGINAL_DIR = r"d:\python_codes\images_app\images_app\backend\images"

# 遍历所有日期目录
def create_thumbnails():
    # 遍历原始图片目录
    for root, dirs, files in os.walk(ORIGINAL_DIR):
        for dir_name in dirs:
            # 跳过已处理的缩略图目录
            if "_1" in dir_name:
                continue
                
            # 创建对应的缩略图目录
            original_dir = os.path.join(root, dir_name)
            thumbnail_dir = os.path.join(root, f"{dir_name}_1")
            os.makedirs(thumbnail_dir, exist_ok=True)
            
            print(f"Processing directory: {original_dir}")
            
            # 遍历该目录下的所有图片
            for file_name in os.listdir(original_dir):
                if file_name.lower().endswith((".jpg", ".jpeg", ".png", ".gif")):
                    original_path = os.path.join(original_dir, file_name)
                    thumbnail_path = os.path.join(thumbnail_dir, file_name)
                    
                    try:
                        # 删除现有的缩略图（如果存在）
                        if os.path.exists(thumbnail_path):
                            os.remove(thumbnail_path)
                            print(f"Deleted existing thumbnail: {thumbnail_path}")
                        
                        # 打开原始图片
                        with Image.open(original_path) as img:
                            # 生成缩略图
                            img.thumbnail(THUMBNAIL_SIZE, Image.LANCZOS)
                            # 保存缩略图
                            img.save(thumbnail_path, quality=THUMBNAIL_QUALITY)
                            print(f"Created new thumbnail: {thumbnail_path}")
                    except Exception as e:
                        print(f"Error processing {original_path}: {e}")

if __name__ == "__main__":
    create_thumbnails()
