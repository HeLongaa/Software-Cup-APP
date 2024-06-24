# 使用Python作为基础镜像
FROM python:3.9
# 设置工作目录
WORKDIR /app
# 复制应用代码到容器中
COPY . /app
# 安装依赖项
RUN pip install --no-cache-dir -r requirements.txt
# 暴露应用端口
EXPOSE 5000
# 设置启动命令
CMD ["python", "app.py"]