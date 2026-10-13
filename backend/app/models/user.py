from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    avatar_url = Column(String(255), nullable=True)
    bio = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    # 图片共享开关：True=允许他人查看我的图片，False=仅自己可见
    is_public = Column(Boolean, default=True)
    verification_token = Column(String(255), nullable=True)
    password_reset_token = Column(String(255), nullable=True)
    # 注册验证码相关字段
    registration_otp = Column(String(6), nullable=True)  # 6位验证码
    otp_expires_at = Column(DateTime, nullable=True)  # 验证码过期时间
    # 使用应用层本地时间，避免数据库CURRENT_TIMESTAMP(UTC)导致差8小时
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    # 关联关系：一个用户可以上传多张图片
    images = relationship("Image", back_populates="user")
