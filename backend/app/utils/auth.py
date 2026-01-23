from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
import secrets
from config.settings import settings

# JWT配置 - SECRET_KEY由settings.py确保始终存在
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# 验证密码复杂度
def validate_password(password: str) -> bool:
    """
    验证密码复杂度
    - 至少8个字符
    - 至少包含一个大写字母
    - 至少包含一个小写字母
    - 至少包含一个数字
    - 至少包含一个特殊字符
    """
    import re
    if len(password) < 8:
        return False
    if not re.search(r'[a-zA-Z]', password):
        return False
    # if not re.search(r'[a-z]', password):
    #     return False
    # if not re.search(r'\d', password):
    #     return False
    # if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
    #     return False
    return True

# 生成密码哈希
def get_password_hash(password: str) -> str:
    # 验证密码复杂度
    if not validate_password(password):
        raise ValueError("密码复杂度不足：至少8个字符，包含字母")
    
    # bcrypt限制密码长度为72字节，超过会抛出异常，需要手动截断
    password = password[:72]
    # 使用直接的bcrypt库进行哈希
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

# 验证密码
def verify_password(plain_password: str, hashed_password: str) -> bool:
    # 验证时也需要截断密码，因为哈希是基于截断后的密码生成的
    plain_password = plain_password[:72]
    # 使用直接的bcrypt库进行验证
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# 创建访问令牌
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# 创建刷新令牌
def create_refresh_token(data: dict) -> str:
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = data.copy()
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# 生成验证令牌
def generate_verification_token() -> str:
    return secrets.token_urlsafe(32)

# 生成密码重置令牌
def generate_password_reset_token() -> str:
    return secrets.token_urlsafe(32)

# 验证JWT令牌
def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

# 生成6位数字验证码
def generate_otp() -> str:
    import random
    # 生成6位随机数字
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])
