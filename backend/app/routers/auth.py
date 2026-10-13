from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import (
    UserCreate, UserLogin, UserResponse, Token, 
    PasswordResetRequest, PasswordReset, UserUpdate, PasswordChange,
    RegisterOtpRequest, VerifyOtpRequest
)
from app.utils.auth import (
    get_password_hash, verify_password, create_access_token, 
    generate_verification_token, generate_password_reset_token
)
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

router = APIRouter(
    prefix="/auth",
    tags=["authentication"],
)

# OAuth2密码Bearer模式
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# 获取当前用户
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    from app.utils.auth import verify_token
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

# 获取当前活跃用户
def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# 请求注册验证码
@router.post("/register/otp")
def request_register_otp(request: RegisterOtpRequest, db: Session = Depends(get_db)):
    """请求注册验证码"""
    from app.utils.email import send_registration_otp
    from app.utils.auth import generate_otp
    from app.utils.redis import set_otp
    
    # 检查邮箱是否已存在
    existing_email = db.query(User).filter(User.email == request.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="邮箱已被注册"
        )
    
    # 生成6位验证码
    otp = generate_otp()
    # 设置验证码过期时间为5分钟（300秒）
    set_otp(request.email, otp, expires_in=300)
    
    # 发送验证码邮件
    send_registration_otp(request.email, otp)
    
    return {"message": "验证码已发送到您的邮箱，有效期5分钟"}

# 验证注册验证码
@router.post("/register/verify-otp")
def verify_register_otp(request: VerifyOtpRequest, db: Session = Depends(get_db)):
    """验证注册验证码"""
    from app.utils.redis import get_otp, delete_otp
    
    # 从Redis获取验证码
    stored_otp = get_otp(request.email)
    
    if not stored_otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="无效的验证码或验证码已过期"
        )
    
    if stored_otp != request.otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="无效的验证码"
        )
    
    # 验证成功，删除Redis中的验证码
    delete_otp(request.email)
    
    return {"message": "验证码验证成功，可以进行注册"}

# 用户注册
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """用户注册，需要提供有效的验证码"""
    from app.utils.email import send_verification_email
    from app.utils.redis import get_otp, delete_otp
    
    # 检查用户名是否已存在
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户名已被注册"
        )
    
    # 检查邮箱是否已存在
    existing_email = db.query(User).filter(User.email == user.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="邮箱已被注册"
        )
    
    # 从Redis获取验证码进行验证
    stored_otp = get_otp(user.email)
    
    if not stored_otp or stored_otp != user.otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="无效的验证码或验证码已过期"
        )
    
    # 验证码验证成功，删除Redis中的验证码
    delete_otp(user.email)
    
    # 创建用户
    hashed_password = get_password_hash(user.password)
    verification_token = generate_verification_token()
    
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        is_active=True,
        is_verified=False,
        verification_token=verification_token
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # 发送邮箱验证邮件
    send_verification_email(db_user.email, verification_token)
    
    # 返回Pydantic模型
    return UserResponse.model_validate(db_user)

# 用户登录
@router.post("/login", response_model=Token)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    # 查找用户 - 支持用户名或邮箱登录
    user = db.query(User).filter(
        (User.username == user_login.username) | 
        (User.email == user_login.username)
    ).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    # 验证密码
    if not verify_password(user_login.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    # 检查用户是否活跃
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # 创建访问令牌
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(days=7) if user_login.remember_me else None
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.model_validate(user)
    }

# 获取当前用户信息
@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_active_user)):
    return UserResponse.model_validate(current_user)

# 更新用户信息
@router.put("/me", response_model=UserResponse)
def update_me(user_update: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # 更新用户信息
    for field, value in user_update.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    
    return UserResponse.model_validate(current_user)

# 修改密码
@router.post("/change-password")
def change_password(password_change: PasswordChange, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    # 验证当前密码
    if not verify_password(password_change.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # 更新密码
    current_user.hashed_password = get_password_hash(password_change.new_password)
    db.commit()
    
    return {"message": "Password changed successfully"}

# 请求密码重置验证码
@router.post("/reset-password/otp")
def request_reset_password_otp(reset_request: PasswordResetRequest, db: Session = Depends(get_db)):
    """请求密码重置验证码"""
    from app.utils.email import send_password_reset_otp
    from app.utils.auth import generate_otp
    from app.utils.redis import set_otp
    
    # 查找用户
    user = db.query(User).filter(User.email == reset_request.email).first()
    if not user:
        # 不泄露用户是否存在
        return {"message": "验证码已发送到您的邮箱（如果邮箱存在）"}
    
    # 生成6位验证码
    otp = generate_otp()
    # 设置验证码过期时间为5分钟（300秒）
    set_otp(user.email, otp, expires_in=300)
    
    # 发送验证码邮件
    send_password_reset_otp(user.email, otp)
    
    return {"message": "验证码已发送到您的邮箱，有效期5分钟"}

# 验证密码重置验证码
@router.post("/reset-password/verify-otp")
def verify_reset_password_otp(verify: VerifyOtpRequest, db: Session = Depends(get_db)):
    """验证密码重置验证码"""
    from app.utils.redis import get_otp, delete_otp
    
    # 从Redis获取验证码
    stored_otp = get_otp(verify.email)
    
    if not stored_otp or stored_otp != verify.otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="无效的验证码或验证码已过期"
        )
    
    # 验证成功，删除Redis中的验证码
    delete_otp(verify.email)
    
    # 生成一个短期的密码重置令牌，用于后续重置密码
    from app.utils.auth import generate_password_reset_token
    reset_token = generate_password_reset_token()
    
    # 查找用户
    user = db.query(User).filter(User.email == verify.email).first()
    if user:
        # 保存重置令牌到用户记录
        user.password_reset_token = reset_token
        db.commit()
    
    return {"message": "验证码验证成功，可以重置密码", "reset_token": reset_token}

# 重置密码
@router.post("/reset-password")
def reset_password(reset: PasswordReset, db: Session = Depends(get_db)):
    """重置密码"""
    # 查找用户
    user = db.query(User).filter(User.password_reset_token == reset.token).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="无效的重置令牌或令牌已过期"
        )
    
    # 更新密码
    user.hashed_password = get_password_hash(reset.new_password)
    user.password_reset_token = None  # 清除重置令牌
    db.commit()
    
    return {"message": "密码重置成功"}

# 验证邮箱
@router.get("/verify-email/{token}")
def verify_email(token: str, db: Session = Depends(get_db)):
    # 查找用户
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    
    # 验证用户
    user.is_verified = True
    user.verification_token = None
    db.commit()
    
    return {"message": "Email verified successfully"}
