# 项目基于的python版本
FROM python:3.11
# 把store项目 添加到code文件夹 (code无需创建)
ADD ./app /code
# 把code设置为工作目录
WORKDIR /code
# 导入项目依赖包
RUN pip install -r requirements.txt
# 端口5000 (可删除)
EXPOSE 5000
# 执行
CMD ["python", "/code/app.py", "0.0.0.0"]
