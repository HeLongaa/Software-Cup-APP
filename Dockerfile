# 使用官方Python运行时作为父镜像
FROM python:3.8-slim

# 设置工作目录
WORKDIR /app

# 将requirements.txt复制到工作目录
COPY requirements.txt .

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 将当前目录下的所有文件复制到工作目录下
COPY . .

# 暴露端口
EXPOSE 5000

# 运行应用
CMD ["python", "./app.py"]