from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    filename = Column(String(255), nullable=False)
    filepath = Column(String(255), nullable=False)
    width = Column(Integer, nullable=False)
    height = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # 使用应用层本地时间，避免数据库CURRENT_TIMESTAMP(UTC)导致差8小时
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    # 关联关系：一张图片属于一个用户
    user = relationship("User", back_populates="images")
