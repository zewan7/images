from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # 应用配置
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8888
    DEBUG: bool = True
    SECRET_KEY: str = "your-secret-key-change-this-in-production"  # JWT密钥
    
    # 数据库配置 - 使用MySQL
    DATABASE_URL: str = "mysql+pymysql://ee:5tgb%TGB@47.109.52.163:3306/images_db"
    
    # 图片存储配置
    IMAGE_UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "images")
    IMAGE_BASE_URL: str = "http://localhost:8888/images"
    
    # 邮件配置（用于邮件验证）
    SMTP_SERVER: str = "smtp.qq.com"
    SMTP_PORT: int = 465
    SMTP_USERNAME: str = "528244020@qq.com"
    SMTP_PASSWORD: str = "ieebobvlwbsvbhcj"
    EMAIL_FROM: str = "528244020@qq.com"
    
    # Redis配置（用于存储验证码）
    REDIS_HOST: str = "47.109.52.163"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: str = "5tgb%TGB"
    REDIS_DB: int = 0
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
