import logging
import redis
from config.settings import settings

logger = logging.getLogger(__name__)

# 创建Redis客户端实例
redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    password=settings.REDIS_PASSWORD,
    db=settings.REDIS_DB,
    decode_responses=True
)

def set_otp(email: str, otp: str, expires_in: int = 300):
    """
    存储验证码到Redis
    :param email: 用户邮箱
    :param otp: 验证码
    :param expires_in: 过期时间（秒），默认5分钟
    :return: bool
    """
    try:
        key = f"otp:{email}"
        redis_client.setex(key, expires_in, otp)
        logger.debug(f"OTP stored for {email}")
        return True
    except Exception as e:
        logger.error(f"Failed to store OTP for {email}: {str(e)}")
        return False

def get_otp(email: str):
    """
    从Redis获取验证码
    :param email: 用户邮箱
    :return: str | None
    """
    try:
        key = f"otp:{email}"
        otp = redis_client.get(key)
        logger.debug(f"OTP retrieval for {email}: {'found' if otp else 'not found'}")
        return otp
    except Exception as e:
        logger.error(f"Failed to get OTP for {email}: {str(e)}")
        return None

def delete_otp(email: str):
    """
    从Redis删除验证码
    :param email: 用户邮箱
    :return: int 影响的行数
    """
    try:
        key = f"otp:{email}"
        result = redis_client.delete(key)
        logger.debug(f"OTP deleted for {email}")
        return result
    except Exception as e:
        logger.error(f"Failed to delete OTP for {email}: {str(e)}")
        return 0
