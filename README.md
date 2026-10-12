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
- ✅ 用户专属空间
  - 我的图片：查看和管理个人上传的所有图片
  - 个人资料：查看和编辑用户信息、头像
  - 隐私保护：特定用户（id=3）上传的图片为私密图像，仅该用户自己可见，其他用户无法查看

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

> 注意：Termux（Android 终端）无法运行 Docker，请使用下方的 [方法三：Termux 部署](#方法三termux-部署android-手机无需-dockerredis邮箱)。

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
| APP_PORT | 应用端口（前端代理硬编码指向8301，改动需同步前端配置） | 8301 |
| DEBUG | 调试模式 | False |
| SECRET_KEY | JWT密钥 | your-secret-key-change-this-in-production |
| IMAGE_UPLOAD_DIR | 图片存储目录 | ./images |
| IMAGE_BASE_URL | 图片访问基础URL | http://localhost:8301/images |
| SMTP_SERVER | 邮件服务器 | smtp.qq.com |
| SMTP_PORT | 邮件服务器端口 | 465 |
| SMTP_USERNAME / SMTP_PASSWORD / EMAIL_FROM | 发件邮箱及授权码 | 空 |
| EMAIL_MODE | 邮件发送后端：`smtp`=真实发送；`console`=验证码输出到后端日志（无需邮箱） | console |
| REDIS_HOST | Redis主机（仅 `OTP_STORAGE_BACKEND=redis` 时需要） | localhost |
| REDIS_PORT | Redis端口 | 6379 |
| OTP_STORAGE_BACKEND | 验证码存储后端：`memory`=纯Python内存（不依赖Redis，重启丢失）；`redis`=使用Redis | memory |
| AI_API_URL | AI API地址 | https://api.siliconflow.cn/v1/chat/completions |
| AI_MODEL | AI模型名称 | Qwen/Qwen2.5-VL-72B-Instruct |
| AI_API_KEY | AI API密钥 | your-ai-api-key |

### 方法三：Termux 部署（Android 手机，无需 Docker/Redis/邮箱）

Termux 无法运行 Docker，但本项目技术栈（FastAPI + SQLite + React）在 Termux 上全部可用。项目内置了一键脚本，已默认切换为**内存验证码 + 控制台邮件 + SQLite**，无需安装 Redis、无需配置邮箱。

1. 安装 Termux 后执行：

   ```bash
   pkg update -y && pkg upgrade -y
   # 复制项目到 ~/images（如通过 git clone 或 scp 传输）
   cd ~/images
   bash termux_deploy.sh
   ```

   脚本会自动完成：安装依赖（python/nodejs/redis 工具链）→ 安装 pip/npm 依赖 → 生成 `.env`（自动生成 SECRET_KEY，默认 8301 端口 + memory 后端 + console 邮件）→ 构建前端 → 启动后端。

2. 另开一个终端启动前端：

   ```bash
   cd ~/images/frontend
   npm run preview -- --host
   ```

3. 手机浏览器访问 `http://localhost:8300`；电脑访问需手机与电脑同一 Wi-Fi，用 `http://<手机局域网IP>:8300`。

4. 以后重启服务，直接用：

   ```bash
   cd ~/images
   bash termux_start.sh   # 同时拉起前后端
   ```

注意事项：

- **验证码**：`EMAIL_MODE=console` 时注册/找回密码的验证码直接打印在后端终端/日志中，从那里抄取即可（无需配置邮箱）。
- **注册依赖验证码**：Redis 未启动时注册接口会报错，请保持 `OTP_STORAGE_BACKEND=memory`（默认，无需 Redis）；若改用 `redis` 后端，需先 `redis-server --daemonize yes`。
- **后台被杀**：手机熄屏后 Termux 进程可能被系统回收，需保持 Termux 前台运行，或用 `pkg install termux-api` + `termux-wake-lock` 保活。
- **图片存储**：图片存在手机 Termux 内部目录 `backend/images/`（按日期分目录），注意备份，避免被清理工具误删。
- **端口**：后端固定 8301（前端 Vite 代理硬编码指向它），`.env` 中 `APP_PORT` 与 `IMAGE_BASE_URL` 已默认对齐。

如需自定义部署方式（如使用 Redis、真实邮箱），修改 `backend/.env` 中 `OTP_STORAGE_BACKEND` 和 `EMAIL_MODE` 两个开关即可，无需改代码。

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

2. **图片加载 404**
   - 开发模式（`npm run dev`）下图片走 `/images` 代理，`vite.config.js` 已配置代理到后端 8301；若改动过端口，请同步修改 `frontend/vite.config.js` 中的 proxy 和后端 `IMAGE_BASE_URL`

3. **AI分析功能无法使用**
   - AI 调用是批量导入脚本 `backend/tests/import_images_with_ai.py` 中的功能，应用内无 AI 分析入口；如需使用请配置 `AI_API_KEY` 后运行该脚本

4. **注册/登录失败**
   - 检查 `EMAIL_MODE=console` 时验证码是否已在后端终端输出；改用 `smtp` 需先验证邮件服务器配置（QQ/163 邮箱需开启 SMTP 服务并获取授权码）
   - 检查 Redis：使用 `OTP_STORAGE_BACKEND=redis` 时需确认 `redis-server` 已启动

5. **用户注册后无法登录**
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
