import logging
import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routers import images, auth
from app.database import engine, Base
from app.models import image, user  # 导入所有模型，确保表被创建
from config.settings import settings

# 创建日志目录
os.makedirs('logs', exist_ok=True)

# 配置日志系统
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    handlers=[
        logging.StreamHandler(),  # 控制台输出
        logging.FileHandler('logs/app.log', encoding='utf-8')  # 文件输出
    ]
)

logger = logging.getLogger(__name__)

# 创建数据库表
Base.metadata.create_all(bind=engine)
logger.info("Database tables created/verified")

# 初始化FastAPI应用
app = FastAPI(
    title="Image Gallery API",
    description="API for image gallery application",
    version="1.0.0",
)
logger.info("FastAPI application initialized")

# 配置CORS
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载静态文件服务，用于提供图片访问
app.mount("/images", StaticFiles(directory=settings.IMAGE_UPLOAD_DIR), name="images")

# 注册路由
app.include_router(images.router, prefix="/api")
app.include_router(auth.router, prefix="/api")

# 根路径
@app.get("/")
def read_root():
    return {"message": "Welcome to Image Gallery API"}

# 运行应用
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.APP_HOST,
        port=settings.APP_PORT,
        reload=settings.DEBUG
    )
