import os
import sys
import shutil
from datetime import datetime
from PIL import Image
import requests
import base64
from sqlalchemy.orm import Session

# 添加项目根目录到Python导入路径
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.models.user import User
from app.models.image import Image as DBImage
from app.database import SessionLocal
from config.settings import settings
from io import BytesIO

# 从配置文件中读取AI配置
AI_API_URL = settings.AI_API_URL
AI_MODEL = settings.AI_MODEL
AI_API_KEY = settings.AI_API_KEY
THUMBNAIL_SIZE = settings.thumbnail_size_tuple
THUMBNAIL_QUALITY = settings.THUMBNAIL_QUALITY
DEFAULT_USER_ID = 3
MAX_SIZE = 768       # 最长边限制（768对大多数场景足够，如果想更省Token可改512）
JPEG_QUALITY = 85    # 压缩质量（85是清晰度和体积的绝佳平衡）

# 将图片转换为base64格式，用于AI API调用
def image_to_base64(image_path):
    try:
        with Image.open(image_path) as img:
            # 转换为 RGB 模式（防止 PNG 的透明通道导致保存 JPEG 报错）
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            # 等比缩放
            img.thumbnail((MAX_SIZE, MAX_SIZE), Image.Resampling.LANCZOS)

            # 保存到内存中的字节流
            buffer = BytesIO()
            img.save(buffer, format="JPEG", quality=JPEG_QUALITY)

            # 提取压缩后的字节
            compressed_bytes = buffer.getvalue()
            print(f"✅ 原图已压缩，压缩后大小: {len(compressed_bytes) / 1024:.2f} KB")

            # 转 Base64
            base64_str = base64.b64encode(compressed_bytes).decode("utf-8")
            return base64_str

    except Exception as e:
        print(f"图片处理失败: {e}")
        exit()

# 调用AI API生成标题和描述
def generate_ai_content(image_path):
    # 将图片转换为base64
    img_base64 = image_to_base64(image_path)
    
    # 构建请求体
    payload = {
        "model": AI_MODEL,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "请为这张图片生成一个标题和描述。标题要简洁生动富有创造力，不超过20个字符；描述要详细一些，包括图片的风格、色彩等，使用幽默风趣的话语，不超过100个字符。请按照以下格式返回：\n标题：<标题内容>\n描述：<描述内容>"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{img_base64}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 100
    }
    
    # 发送请求
    headers = {
        "Authorization": f"Bearer {AI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(AI_API_URL, json=payload, headers=headers)
        response.raise_for_status()
        
        # 解析响应
        content = response.json()['choices'][0]['message']['content']
        
        # 提取标题和描述
        title = content.split('标题：')[1].split('\n')[0].strip()
        description = content.split('描述：')[1].strip()
        
        return title, description
    except Exception as e:
        print(f"AI API调用失败：{str(e)}")
        # 失败时使用默认值
        return f"图片_{os.path.basename(image_path)}", f"这是一张图片：{os.path.basename(image_path)}"

# 生成缩略图
def generate_thumbnail(image_path, thumbnail_path):
    try:
        with Image.open(image_path) as img:
            img.thumbnail(THUMBNAIL_SIZE, Image.LANCZOS)
            img.save(thumbnail_path, quality=THUMBNAIL_QUALITY)
        return True
    except Exception as e:
        print(f"生成缩略图失败：{str(e)}")
        return False

# 处理单个图片
def process_image(image_path, db: Session):
    # 获取当前日期，格式：YYYYMMDD
    current_date = datetime.now().strftime("%Y%m%d")
    
    # 获取文件名
    filename = os.path.basename(image_path)
    
    # 检查文件是否已存在于数据库
    existing_image = db.query(DBImage).filter(DBImage.filename == filename).first()
    if existing_image:
        print(f"图片 {filename} 已存在于数据库中，跳过")
        return False
    
    # 创建目标目录
    original_dir = os.path.join(settings.IMAGE_UPLOAD_DIR, current_date)
    thumbnail_dir = os.path.join(settings.IMAGE_UPLOAD_DIR, f"{current_date}_1")
    os.makedirs(original_dir, exist_ok=True)
    os.makedirs(thumbnail_dir, exist_ok=True)
    
    # 目标文件路径
    target_path = os.path.join(original_dir, filename)
    thumbnail_path = os.path.join(thumbnail_dir, filename)
    
    # 复制图片到目标目录
    shutil.copy2(image_path, target_path)
    
    # 生成缩略图
    if not generate_thumbnail(target_path, thumbnail_path):
        return False
    
    # 获取图片尺寸
    with Image.open(target_path) as img:
        width, height = img.size
    
    # 使用AI生成标题和描述
    title, description = generate_ai_content(target_path)
    
    # 创建Image对象
    image = DBImage(
        title=title,
        description=description,
        filename=filename,
        filepath=target_path,
        width=width,
        height=height,
        user_id=DEFAULT_USER_ID
    )
    
    # 添加到数据库
    db.add(image)
    print(f"成功处理图片: {image_path} -> {title}")
    return True

# 主函数
def import_images(image_dir):
    # 创建数据库会话
    db = SessionLocal()
    
    processed_count = 0
    
    # 遍历指定目录下的所有图片
    for root, dirs, files in os.walk(image_dir):
        for filename in files:
            # 过滤图片文件
            if filename.lower().endswith((".jpg", ".jpeg", ".png", ".gif")):
                # 获取文件路径
                filepath = os.path.join(root, filename)
                
                try:
                    # 处理图片
                    if process_image(filepath, db):
                        # 每张图片处理完成后立即提交事务
                        db.commit()
                        processed_count += 1
                        print(f"图片 {filename} 已成功入库！")
                except Exception as e:
                    # 回滚当前事务
                    db.rollback()
                    print(f"处理图片 {filename} 失败: {str(e)}")
                    # 继续处理下一张图片
                    continue
    
    print(f"\n导入完成！共成功处理 {processed_count} 张图片")
    
    # 关闭数据库会话
    db.close()
    return processed_count

# 命令行入口
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("用法: python import_images_with_ai.py <图片目录>")
        sys.exit(1)
    
    image_dir = sys.argv[1]
    if not os.path.isdir(image_dir):
        print(f"错误: {image_dir} 不是一个有效的目录")
        sys.exit(1)
    
    import_images(image_dir)
