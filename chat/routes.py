from flask import Blueprint, request, jsonify, render_template
import _thread as thread
import base64
import hashlib
import hmac
import json
from urllib.parse import urlencode, urlparse
from wsgiref.handlers import format_date_time
import ssl
from datetime import datetime
from time import mktime
import websocket

chat_bp = Blueprint('chat', __name__, template_folder='templates')

chat_history = []
response_content = ""

class WebSocketParams:
    def __init__(self, app_id, api_key, api_secret, gpt_url):
        self.app_id = app_id
        self.api_key = api_key
        self.api_secret = api_secret
        self.host = urlparse(gpt_url).netloc
        self.path = urlparse(gpt_url).path
        self.gpt_url = gpt_url

    def generate_url(self):
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
    print("### Error encountered:", error)

def handle_close(ws, *args):
    print("### Connection closed ###")

def handle_open(ws):
    thread.start_new_thread(send_message, (ws,))

def generate_request_params(app_id, query, domain):
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
    params = generate_request_params(ws.app_id, ws.query, ws.domain)
    ws.send(json.dumps(params))

def handle_message(ws, message):
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
    chat_history.append({"role": role, "content": content})
    return chat_history

def calculate_total_length(chat_history):
    return sum(len(record["content"]) for record in chat_history)

def truncate_chat_history(chat_history):
    while calculate_total_length(chat_history) > 8000:
        chat_history.pop(0)
    return chat_history

def initialize_websocket_connection(app_id, api_secret, api_key, gpt_url, domain, query):
    ws_params = WebSocketParams(app_id, api_key, api_secret, gpt_url)
    websocket.enableTrace(False)
    ws_url = ws_params.generate_url()
    ws = websocket.WebSocketApp(ws_url, on_message=handle_message, on_error=handle_error, on_close=handle_close,
                                on_open=handle_open)
    ws.app_id = app_id
    ws.query = query
    ws.domain = domain
    ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})

@chat_bp.route('/')
def index():
    return render_template('chat_index.html')

@chat_bp.route('/chat', methods=['POST'])
def chat():
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
