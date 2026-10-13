from pydantic_settings import BaseSettings
from typing import Optional
import os
import secrets
import logging

logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    # 应用配置
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 9000
    DEBUG: bool = True

    # 安全密钥配置 - 必须从环境变量设置，生产环境不可使用默认值
    SECRET_KEY: str = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # 如果没有设置SECRET_KEY，生成一个随机密钥（仅用于开发环境）
        if not self.SECRET_KEY:
            if self.DEBUG:
                self.SECRET_KEY = secrets.token_hex(32)
                logger.warning(
                    "WARNING: SECRET_KEY not set in environment variables. "
                    "A random key has been generated for development. "
                    "Please set SECRET_KEY in .env file for production!"
                )
            else:
                raise ValueError(
                    "SECRET_KEY must be set in environment variables for production deployment. "
                    "Please add SECRET_KEY to your .env file with a strong random value."
                )
    
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
    EMAIL_FROM_NAME: str = ""  # 发件人显示名（可选，支持中文），如"视觉画廊"

    # 验证码存储后端：redis=使用Redis，memory=使用纯Python内存存储（不依赖Redis）
    OTP_STORAGE_BACKEND: str = "memory"

    # Redis配置（OTP_STORAGE_BACKEND=redis 时使用）
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: str = ""
    REDIS_DB: int = 0

    # 邮件发送后端：smtp=真实发送，console=验证码输出到日志（无需邮箱，适合Termux/开发环境）
    EMAIL_MODE: str = "console"
    
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
