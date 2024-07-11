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
     
2. BT面板安装：  
  
   1. 安装BT面板（特殊版本）：  
   CentOS：yum install -y wget && wget -O install.sh http://www.btkaixin.net/install/install_6.0.sh && sh install.sh  
   Ubuntu/Debian：wget -O install.sh http://www.btkaixin.net/install/install_6.0.sh && bash install.sh  
   2. 安装Python 3.11.4  
   3. 添加项目  
   4. 启动项目，配置如下：  
   ![demo](/static/images/demo.png)  
   5. 访问链接：  
   6. 配置反向代理及ssl  
  
3. Docker镜像：待添加