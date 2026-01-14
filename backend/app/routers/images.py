from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.image import Image
from app.schemas.image import ImageCreate, ImageResponse, ImageListResponse
from app.routers.auth import get_current_active_user
from app.models.user import User
from config.settings import settings
from PIL import Image as PILImage
import os
import uuid
from typing import List
from datetime import datetime

router = APIRouter(
    prefix="/images",
    tags=["images"],
)

# 确保图片上传目录存在
os.makedirs(settings.IMAGE_UPLOAD_DIR, exist_ok=True)

# 辅助函数：生成图片URL
def get_image_url(image, is_thumbnail=True):
    """根据图片对象生成URL，首页返回缩略图URL，详情页返回原图URL"""
    # 直接从文件路径中提取日期目录和文件名
    # 例如：D:\python_codes\images_app\images_app\backend\images\20260109\1q11gv.jpg
    filepath = image.filepath
    filename = image.filename
    
    # 查找日期目录（8位数字）
    import re
    # 匹配两种分隔符：斜杠和反斜杠
    date_match = re.search(r'[\\/](\d{8})[\\/]', filepath)
    
    if date_match:
        date_dir = date_match.group(1)
        
        if is_thumbnail:
            # 首页返回缩略图URL（日期_1目录）
            return f"/images/{date_dir}_1/{filename}"
        else:
            # 详情页返回原图URL（日期目录）
            return f"/images/{date_dir}/{filename}"
    else:
        # 如果找不到日期目录，返回原始文件名URL
        return f"/images/{filename}"

# 获取图片列表
@router.get("/", response_model=List[ImageListResponse])
@router.get("", response_model=List[ImageListResponse])  # 添加不带斜杠的路由版本
def get_images(skip: int = 0, limit: int = 100, search: str = None, db: Session = Depends(get_db)):
    # 关联用户表，获取用户名 - 使用左连接确保所有图片都能返回
    from sqlalchemy.orm import joinedload
    query = db.query(Image, User.username).outerjoin(User, Image.user_id == User.id)
    
    # 添加搜索过滤
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Image.title.ilike(search_term)) | 
            (Image.description.ilike(search_term)) | 
            (User.username.ilike(search_term))
        )
    
    images = query.offset(skip).limit(limit).all()
    
    # 处理结果，添加URL和用户名
    result = []
    for image, username in images:
        image.url = get_image_url(image)
        # 添加username属性，处理可能为None的情况
        image.username = username or "未知用户"
        result.append(image)
    return result

# 获取单个图片详情
@router.get("/{image_id}", response_model=ImageResponse)
def get_image(image_id: int, db: Session = Depends(get_db)):
    # 关联用户表，获取用户名 - 使用左连接确保所有图片都能返回
    result = db.query(Image, User.username).outerjoin(User, Image.user_id == User.id).filter(Image.id == image_id).first()
    if not result:
        raise HTTPException(status_code=404, detail="Image not found")
    
    image, username = result
    # 添加图片URL和用户名 - 详情页返回原图URL
    image.url = get_image_url(image, is_thumbnail=False)
    image.username = username or "未知用户"
    return image

# 上传图片（需要认证）
@router.post("/", response_model=ImageResponse)
@router.post("", response_model=ImageResponse)  # 添加不带斜杠的路由版本
async def upload_image(
    title: str = Form(...),
    description: str = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # 验证文件类型
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # 验证文件大小（限制为20MB）
    file_size = 0
    content = await file.read()
    file_size = len(content)
    if file_size > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size must be less than 20MB")
    
    # 按日期创建子目录
    date_dir = datetime.now().strftime("%Y%m%d")  # 使用YYYYMMDD格式，与前端一致
    upload_dir = os.path.join(settings.IMAGE_UPLOAD_DIR, date_dir)
    os.makedirs(upload_dir, exist_ok=True)
    
    # 生成唯一文件名
    filename = f"{uuid.uuid4()}.{file.filename.split('.')[-1]}"
    filepath = os.path.join(upload_dir, filename)
    
    # 保存文件
    with open(filepath, "wb") as buffer:
        buffer.write(content)
    
    # 获取图片尺寸
    with PILImage.open(filepath) as img:
        width, height = img.size
    
    # 生成缩略图
    thumbnail_dir = os.path.join(settings.IMAGE_UPLOAD_DIR, f"{date_dir}_1")
    os.makedirs(thumbnail_dir, exist_ok=True)
    thumbnail_path = os.path.join(thumbnail_dir, filename)
    
    with PILImage.open(filepath) as img:
        # 生成缩略图，保持宽高比，提高尺寸和质量
        img.thumbnail((500, 500), PILImage.LANCZOS)
        img.save(thumbnail_path, quality=95)
    
    # 创建图片记录，关联当前用户
    db_image = Image(
        title=title,
        description=description,
        filename=filename,
        filepath=filepath,
        width=width,
        height=height,
        user_id=current_user.id
    )
    
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    
    # 添加图片URL和用户名
    db_image.url = f"{settings.IMAGE_BASE_URL}/{date_dir}/{db_image.filename}"
    db_image.username = current_user.username  # 添加用户名
    
    return db_image

# 获取当前用户上传的图片
@router.get("/my", response_model=List[ImageListResponse])
@router.get("/my/", response_model=List[ImageListResponse])  # 添加带斜杠的路由版本
def get_my_images(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    try:
        # 关联用户表，获取用户名
        images = db.query(Image, User.username).join(User, Image.user_id == User.id).filter(Image.user_id == current_user.id).offset(skip).limit(limit).all()
        # 处理结果，添加URL和用户名
        result = []
        for image, username in images:
            image.url = get_image_url(image)
            # 添加username属性
            image.username = username
            result.append(image)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail="获取用户图片失败")

# 删除图片（需要认证）
@router.delete("/{image_id}")
def delete_image(image_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # 查找图片
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # 检查图片是否属于当前用户
    if image.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this image")
    
    # 删除文件
    try:
        if os.path.exists(image.filepath):
            os.remove(image.filepath)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to delete image file")
    
    # 从数据库删除
    db.delete(image)
    db.commit()
    
    return {"message": "Image deleted successfully"}

# 修改图片描述（需要认证）
@router.put("/{image_id}", response_model=ImageResponse)
def update_image_description(
    image_id: int, 
    title: str = Form(None),
    description: str = Form(None),
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    # 查找图片
    image = db.query(Image).filter(Image.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # 检查图片是否属于当前用户
    if image.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this image")
    
    # 更新字段
    if title is not None:
        image.title = title
    if description is not None:
        image.description = description
    
    db.commit()
    db.refresh(image)
    
    # 添加图片URL和用户名
    image.url = get_image_url(image)
    image.username = current_user.username
    
    return image
