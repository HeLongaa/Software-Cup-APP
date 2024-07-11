# Software-Cup-APP  
  
![demo](/static/images/demo.png) 

| ![demo](/static/images/demo2.png) | ![demo](/static/images/demo3.png) |
| --------------------------------- | --------------------------------- |

## 安装和本地启动  
  
- 本项目运行于Python-3.11环境下  
  
  
1. 本地启动  
     
   >    git clone https://github.com/HeLongaa/Software-Cup-APP.git  
    >   
    >    cd Software-Cup-APP  
    >   
    >    pip install requirements.txt  
    >   
    >    set FLASK_APP=app.py  
    >   
    >    flask run  
   
2. Docker镜像：
    > docker pull registry.ap-southeast-1.aliyuncs.com/helongaa/aiedu:1.0.1
    > 
    > 建议指定版本号拉取
    > 
    > docker run -d -p 5000:5000 registry.ap-southeast-1.aliyuncs.com/helongaa/aiedu:1.0.1
    > 
    > 访问ip:5000即可