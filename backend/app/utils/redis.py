import logging
import threading
import time
from config.settings import settings

logger = logging.getLogger(__name__)


class InMemoryOtpStore:
    """纯Python内存验证码存储，替代Redis，适用于无Redis环境（如Termux）"""

    def __init__(self):
        self._store = {}          # key -> (otp, expires_at)
        self._lock = threading.Lock()

    def setex(self, key, expires_in, otp):
        with self._lock:
            self._store[key] = (otp, time.time() + expires_in)
        return True

    def get(self, key):
        with self._lock:
            item = self._store.get(key)
            if not item:
                return None
            otp, expires_at = item
            if time.time() > expires_at:
                self._store.pop(key, None)
                return None
            return otp

    def delete(self, key):
        with self._lock:
            return self._store.pop(key, None) is not None

    def cleanup(self):
        """清理过期条目，可周期性调用"""
        now = time.time()
        with self._lock:
            expired = [k for k, (_, exp) in self._store.items() if now > exp]
            for k in expired:
                self._store.pop(k, None)
        if expired:
            logger.debug(f"InMemoryOtpStore cleaned {len(expired)} expired keys")


# 选择存储后端：redis / memory
if settings.OTP_STORAGE_BACKEND == "memory":
    _redis_client = InMemoryOtpStore()
    logger.warning("使用纯Python内存验证码存储（OTP_STORAGE_BACKEND=memory），验证码重启后丢失，且无法跨进程共享")
else:
    import redis
    _redis_client = redis.Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        password=settings.REDIS_PASSWORD,
        db=settings.REDIS_DB,
        decode_responses=True,
    )


def set_otp(email: str, otp: str, expires_in: int = 300):
    """
    存储验证码
    :param email: 用户邮箱
    :param otp: 验证码
    :param expires_in: 过期时间（秒），默认5分钟
    :return: bool
    """
    try:
        key = f"otp:{email}"
        _redis_client.setex(key, expires_in, otp)
        logger.debug(f"OTP stored for {email}")
        return True
    except Exception as e:
        logger.error(f"Failed to store OTP for {email}: {str(e)}")
        return False


def get_otp(email: str):
    """
    从存储后端获取验证码
    :param email: 用户邮箱
    :return: str | None
    """
    try:
        key = f"otp:{email}"
        otp = _redis_client.get(key)
        logger.debug(f"OTP retrieval for {email}: {'found' if otp else 'not found'}")
        return otp
    except Exception as e:
        logger.error(f"Failed to get OTP for {email}: {str(e)}")
        return None


def delete_otp(email: str):
    """
    从存储后端删除验证码
    :param email: 用户邮箱
    :return: int 影响的行数
    """
    try:
        key = f"otp:{email}"
        result = _redis_client.delete(key)
        logger.debug(f"OTP deleted for {email}")
        return result
    except Exception as e:
        logger.error(f"Failed to delete OTP for {email}: {str(e)}")
        return 0
