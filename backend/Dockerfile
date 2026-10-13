FROM alibaba-cloud-linux-3-registry.cn-hangzhou.cr.aliyuncs.com/alinux3/python:3.11.1
# 设置工作目录
WORKDIR /app

# 移除apt-get安装，因为基础镜像不是基于Debian/Ubuntu的
# 如果需要gcc，使用适合基础镜像的包管理器，如yum或apk

# 复制依赖文件
COPY requirements.txt .

# 安装Python依赖，使用国内镜像
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 8301

# 设置环境变量
ENV PYTHONPATH=/app

# 启动命令（生产环境不使用 --reload）
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8301"]