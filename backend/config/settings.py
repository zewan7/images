from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # 应用配置
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 9000
    DEBUG: bool = True
    SECRET_KEY: str = "your-secret-key-change-this-in-production"  # JWT密钥
    
    # 数据库配置 - 使用SQLite作为默认值
    DATABASE_URL: str = "sqlite:///./images.db"
    
    # 图片存储配置
    IMAGE_UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "images")
    IMAGE_BASE_URL: str = "http://localhost:9000/images"
    
    # 邮件配置（用于邮件验证）
    SMTP_SERVER: str = "smtp.qq.com"
    SMTP_PORT: int = 465
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = ""
    
    # Redis配置（用于存储验证码）
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: str = ""
    REDIS_DB: int = 0
    
    # AI配置
    AI_API_URL: str = "https://api.siliconflow.cn/v1/chat/completions"
    AI_MODEL: str = "Qwen/Qwen2.5-VL-72B-Instruct"
    AI_API_KEY: str = ""
    THUMBNAIL_SIZE: str = "500,500"
    THUMBNAIL_QUALITY: int = 95
    DEFAULT_USER_ID: int = 4
    
    @property
    def thumbnail_size_tuple(self) -> tuple:
        """将THUMBNAIL_SIZE字符串转换为元组"""
        return tuple(map(int, self.THUMBNAIL_SIZE.split(",")))
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
