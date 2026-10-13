from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

# 基础用户Schema
class UserBase(BaseModel):
    username: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    full_name: Optional[str] = Field(None, max_length=100)

# 请求注册验证码Schema
class RegisterOtpRequest(BaseModel):
    email: EmailStr

# 验证注册验证码Schema
class VerifyOtpRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)

# 用户注册Schema
class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=50)
    otp: str = Field(..., min_length=6, max_length=6)  # 新增验证码字段

# 用户登录Schema
class UserLogin(BaseModel):
    username: str
    password: str
    remember_me: bool = False

# 密码重置请求Schema
class PasswordResetRequest(BaseModel):
    email: EmailStr

# 密码重置Schema
class PasswordReset(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=50)

# 用户资料更新Schema
class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    avatar_url: Optional[str] = Field(None, max_length=255)
    is_public: Optional[bool] = None  # 图片共享开关

# 密码修改Schema
class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=50)

# 用户响应Schema
class UserResponse(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    is_public: bool = True  # 图片共享开关
    created_at: datetime
    updated_at: Optional[datetime] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    
    class Config:
        from_attributes = True

# 用户令牌Schema
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# 简单的用户信息Schema（用于关联）
class UserInfo(BaseModel):
    id: int
    username: str
    email: EmailStr
    
    class Config:
        from_attributes = True
