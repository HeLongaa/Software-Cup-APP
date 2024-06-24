#coding=UTF-8
import os

from flask import Flask, request, jsonify, render_template
import _thread as thread
import base64
import hashlib
import hmac
import json
from urllib.parse import urlparse, urlencode
from wsgiref.handlers import format_date_time
import ssl
from datetime import datetime
from time import mktime
import websocket
import time
import requests

# 创建 Flask 应用实例
app = Flask(__name__)

# 初始化聊天记录列表
chat_history = []


class WebSocketParams:
    """用于处理 WebSocket 请求的参数类"""

    def __init__(self, app_id, api_key, api_secret, gpt_url):
        self.app_id = app_id
        self.api_key = api_key
        self.api_secret = api_secret
        self.host = urlparse(gpt_url).netloc
        self.path = urlparse(gpt_url).path
        self.gpt_url = gpt_url

    def generate_url(self):
        """生成用于 WebSocket 连接的完整 URL"""
        now = datetime.now()
        date = format_date_time(mktime(now.timetuple()))

        signature_origin = f"host: {self.host}\ndate: {date}\nGET {self.path} HTTP/1.1"
        signature_sha = hmac.new(self.api_secret.encode('utf-8'), signature_origin.encode('utf-8'),
                                 digestmod=hashlib.sha256).digest()
        signature_sha_base64 = base64.b64encode(signature_sha).decode('utf-8')

        authorization_origin = f'api_key="{self.api_key}", algorithm="hmac-sha256", headers="host date request-line", signature="{signature_sha_base64}"'
        authorization = base64.b64encode(authorization_origin.encode('utf-8')).decode('utf-8')

        url_params = {
            "authorization": authorization,
            "date": date,
            "host": self.host
        }
        return f"{self.gpt_url}?{urlencode(url_params)}"


def handle_error(ws, error):
    """处理 WebSocket 错误事件"""
    print("### Error encountered:", error)


def handle_close(ws, *args):
    """处理 WebSocket 关闭事件"""
    print("### Connection closed ###")


def handle_open(ws):
    """处理 WebSocket 打开事件"""
    thread.start_new_thread(send_message, (ws,))


def generate_request_params(app_id, query, domain):
    """生成请求参数"""
    return {
        "header": {
            "app_id": app_id,
            "uid": "1234",
        },
        "parameter": {
            "chat": {
                "domain": domain,
                "temperature": 0.5,
                "max_tokens": 4096,
                "auditing": "default",
            }
        },
        "payload": {
            "message": {
                "text": query
            }
        }
    }


def send_message(ws, *args):
    """发送消息到 WebSocket 服务器"""
    params = generate_request_params(ws.app_id, ws.query, ws.domain)
    ws.send(json.dumps(params))


def handle_message(ws, message):
    """处理 WebSocket 接收的消息事件"""
    data = json.loads(message)
    if data['header']['code'] != 0:
        print(f"Request error: {data['header']['code']}, {data}")
        ws.close()
    else:
        global response_content
        response_content += data["payload"]["choices"]["text"][0]["content"]
        if data["payload"]["choices"]["status"] == 2:
            ws.close()


def add_chat_record(role, content):
    """添加聊天记录"""
    chat_history.append({"role": role, "content": content})
    return chat_history


def calculate_total_length(chat_history):
    """计算聊天记录的总长度"""
    return sum(len(record["content"]) for record in chat_history)


def truncate_chat_history(chat_history):
    """截断聊天记录以确保总长度不超过限制"""
    while calculate_total_length(chat_history) > 8000:
        chat_history.pop(0)
    return chat_history


def initialize_websocket_connection(app_id, api_secret, api_key, gpt_url, domain, query):
    """初始化 WebSocket 连接"""
    ws_params = WebSocketParams(app_id, api_key, api_secret, gpt_url)
    websocket.enableTrace(False)
    ws_url = ws_params.generate_url()

    ws = websocket.WebSocketApp(ws_url, on_message=handle_message, on_error=handle_error, on_close=handle_close,
                                on_open=handle_open)
    ws.app_id = app_id
    ws.query = query
    ws.domain = domain
    ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})


class AIPPT:
    """用于处理 PPT 生成的类"""

    def __init__(self, app_id, api_secret, text,theme='auto',is_card_note=False):
        self.app_id = app_id
        self.api_secret = api_secret
        self.text = text
        self.header = {}
        self.theme=theme
        self.is_card_note = is_card_note
    def get_signature(self, ts):
        """获取签名"""
        try:
            auth = self.md5(self.app_id + str(ts))
            return self.hmac_sha1_encrypt(auth, self.api_secret)
        except Exception as e:
            print(e)
            return None

    def hmac_sha1_encrypt(self, encrypt_text, encrypt_key):
        """HMAC-SHA1加密并转换为Base64编码"""
        return base64.b64encode(
            hmac.new(encrypt_key.encode('utf-8'), encrypt_text.encode('utf-8'), hashlib.sha1).digest()).decode('utf-8')

    def md5(self, text):
        """MD5加密"""
        return hashlib.md5(text.encode('utf-8')).hexdigest()

    def create_task(self):
        """创建PPT生成任务"""
        url = 'https://zwapi.xfyun.cn/api/aippt/create'
        timestamp = int(time.time())
        signature = self.get_signature(timestamp)
        body = self.getbody(self.text)

        headers = {
            "appId": self.app_id,
            "timestamp": str(timestamp),
            "signature": signature,
            "Content-Type": "application/json; charset=utf-8"
        }
        self.header = headers
        response = requests.post(url, data=json.dumps(body), headers=headers).json()
        if response['code'] == 0:
            return response['data']['sid']
        else:
            print('创建PPT任务失败')
            return None

    def getbody(self, text):
        """构建请求body体"""
        return {"query": text}

    def get_process(self, sid):
        """轮询任务进度，返回完整响应信息"""
        if sid:
            response = requests.get(f"https://zwapi.xfyun.cn/api/aippt/progress?sid={sid}", headers=self.header).json()
            return response
        else:
            return None

    def get_result(self):
        """获取PPT，以下载连接形式返回"""
        task_id = self.create_task()
        while True:
            response = self.get_process(task_id)
            if response and response['data']['process'] == 100:
                return response['data']['pptUrl']
            time.sleep(5)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/PPT')
def PPT():
    return render_template('PPT.html')


@app.route('/Tools')
def Tools():
    return render_template('Tools.html')


@app.route('/result')
def result():
    return render_template('result.html')


@app.route('/chat', methods=['POST'])
def chat():
    """处理聊天请求"""
    user_input = request.form['message']
    query = truncate_chat_history(add_chat_record("user", user_input))
    global response_content
    response_content = ""
    initialize_websocket_connection(
        app_id="c5274a8a",
        api_secret="OThlZmRjZWNkMjA4OWY1YWEyNTA4NjA3",
        api_key="80c687d1f1bbc044a4ed41fb2180f7bd",
        gpt_url="wss://spark-api.xf-yun.com/v3.5/chat",
        domain="generalv3.5",
        query=query
    )
    add_chat_record("assistant", response_content)
    return jsonify({"response": response_content})

@app.route('/generate_ppt', methods=['POST'])
def generate_ppt():
    """处理PPT生成请求"""
    user_input = request.form['message']
    theme_select=request.form.get('theme', 'auto')
    is_card_note_select=request.form.get('is_card_note')=='true'
    ppt_generator = AIPPT(app_id="fc25885c", api_secret="YzJlMjIxMDc1YmY3NzFiMTRjNGFlYmQx", text=user_input,theme=theme_select,is_card_note=is_card_note_select)
    ppt_url = ppt_generator.get_result()
    return jsonify({"ppt_url": ppt_url})


if __name__ == '__main__':
    app.run(port=os.getenv("PORT", default=5000), host='0.0.0.0')

