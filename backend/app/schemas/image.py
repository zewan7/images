from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.schemas.user import UserInfo

# 基础Schema
class ImageBase(BaseModel):
    title: str
    description: Optional[str] = None
    filename: str
    filepath: str
    width: int
    height: int

# 创建图片的Schema
class ImageCreate(ImageBase):
    user_id: int

# 响应的Schema
class ImageResponse(ImageBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    url: str  # 添加图片URL字段
    username: str  # 添加用户名字段
    
    class Config:
        from_attributes = True

# 简化的图片响应Schema（用于列表）
class ImageListResponse(BaseModel):
    id: int
    title: str
    filename: str
    width: int
    height: int
    url: str
    user_id: int
    created_at: datetime
    username: str  # 添加用户名字段
    
    class Config:
        from_attributes = True
