# 图片管理应用

一个功能完整的图片管理应用，包含前端和后端，支持图片上传、管理、AI分析等功能。

## 技术栈

### 前端
- React 18
- React Router 7
- Vite 5

### 后端
- FastAPI
- SQLAlchemy ORM
- Redis
- Python

### 数据库
- 支持 SQLite（默认）
- 支持 MySQL

### 部署
- Docker
- Docker Compose

## 主要功能

- ✅ 用户认证（注册、登录、忘记密码）
- ✅ 图片上传和管理
- ✅ 图片AI分析
- ✅ 图片缩略图生成
- ✅ 图片浏览和详情查看
- ✅ 图片搜索和筛选

## 目录结构

```
images_app/
├── backend/                 # 后端代码
│   ├── app/                 # 应用主目录
│   │   ├── models/          # 数据库模型
│   │   ├── routers/         # API路由
│   │   ├── schemas/         # 数据验证模式
│   │   ├── utils/           # 工具函数
│   │   ├── database.py      # 数据库配置
│   │   └── main.py          # 应用入口
│   ├── config/              # 配置文件
│   ├── tests/               # 测试文件
│   ├── .env.example         # 环境变量示例
│   ├── Dockerfile           # Docker配置
│   └── requirements.txt     # Python依赖
├── frontend/                # 前端代码
│   ├── src/                 # 源代码
│   │   ├── components/      # React组件
│   │   ├── context/         # 上下文管理
│   │   ├── pages/           # 页面组件
│   │   ├── services/        # API服务
│   │   └── App.jsx          # 应用主组件
│   ├── dist/                # 构建产物
│   ├── Dockerfile           # Docker配置
│   ├── package.json         # npm依赖
│   └── vite.config.js       # Vite配置
└── docker-compose.yml       # Docker Compose配置
```

## 安装和运行

### 方法一：使用Docker Compose（推荐）

1. 克隆项目
   ```bash
   git clone <repository-url>
   cd images_app
   ```

2. 配置环境变量
   - 复制后端环境变量示例文件
     ```bash
     cp backend/.env.example backend/.env
     ```
   - 根据需要修改 `.env` 文件中的配置

3. 构建和启动服务
   ```bash
   docker-compose up -d --build
   ```

4. 访问应用
   - 前端：http://localhost:8300
   - 后端API：http://localhost:8301
   - API文档：http://localhost:8301/docs

### 方法二：手动运行

#### 后端运行

1. 进入后端目录
   ```bash
   cd backend
   ```

2. 安装依赖
   ```bash
   pip install -r requirements.txt
   ```

3. 配置环境变量
   ```bash
   cp .env.example .env
   # 修改.env文件
   ```

4. 启动后端服务
   ```bash
   python -m uvicorn app.main:app --reload
   ```

#### 前端运行

1. 进入前端目录
   ```bash
   cd frontend
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 启动开发服务器
   ```bash
   npm run dev
   ```

4. 访问应用：http://localhost:5173

## API文档

后端提供了完整的API文档，可通过以下地址访问：
- Swagger UI：http://localhost:8301/docs
- ReDoc：http://localhost:8301/redoc

## 环境变量配置

后端主要环境变量说明：

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| DATABASE_URL | 数据库连接URL | sqlite:///./images.db |
| APP_HOST | 应用主机地址 | 0.0.0.0 |
| APP_PORT | 应用端口 | 9000 |
| DEBUG | 调试模式 | True |
| SECRET_KEY | JWT密钥 | your-secret-key-change-this-in-production |
| IMAGE_UPLOAD_DIR | 图片存储目录 | ./images |
| IMAGE_BASE_URL | 图片访问基础URL | http://localhost:9000/images |
| SMTP_SERVER | 邮件服务器 | smtp.qq.com |
| SMTP_PORT | 邮件服务器端口 | 465 |
| REDIS_HOST | Redis主机 | localhost |
| REDIS_PORT | Redis端口 | 6379 |
| AI_API_URL | AI API地址 | https://api.siliconflow.cn/v1/chat/completions |
| AI_MODEL | AI模型名称 | Qwen/Qwen2.5-VL-72B-Instruct |
| AI_API_KEY | AI API密钥 | your-ai-api-key |

## 开发说明

### 后端开发

1. 数据库迁移：使用SQLAlchemy ORM，模型变更后需要重新生成数据库表
2. API开发：在 `app/routers/` 目录下添加新的路由
3. 模型开发：在 `app/models/` 目录下定义数据库模型
4. 数据验证：在 `app/schemas/` 目录下定义Pydantic模型

### 前端开发

1. 组件开发：在 `src/components/` 目录下创建新组件
2. 页面开发：在 `src/pages/` 目录下创建新页面
3. API调用：使用 `src/services/api.js` 中的封装方法
4. 状态管理：使用React Context API（在 `src/context/` 目录下）

## 测试

### 后端测试

1. 进入后端目录
   ```bash
   cd backend
   ```

2. 运行测试
   ```bash
   pytest tests/
   ```

### 前端测试

1. 进入前端目录
   ```bash
   cd frontend
   ```

2. 运行lint检查
   ```bash
   npm run lint
   ```

## 构建生产版本

### 前端构建

```bash
cd frontend
npm run build
```

构建产物将生成在 `dist/` 目录下。

## 常见问题

1. **图片上传失败**
   - 检查 `IMAGE_UPLOAD_DIR` 目录是否存在且有写入权限
   - 检查文件大小限制（默认无限制，可在代码中配置）

2. **AI分析功能无法使用**
   - 检查 `AI_API_KEY` 是否正确配置
   - 检查网络连接是否正常
   - 查看后端日志获取详细错误信息

3. **用户注册后无法登录**
   - 检查邮件服务器配置是否正确
   - 检查Redis服务器是否正常运行

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

如有问题或建议，请通过以下方式联系：
- Email: your-email@example.com
- GitHub: your-github-username
