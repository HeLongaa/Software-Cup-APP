from time import mktime

from flask import Blueprint, request, jsonify, render_template
import base64
import hashlib
import hmac
import json
import requests
from datetime import datetime
from wsgiref.handlers import format_date_time
from urllib.parse import urlencode

text_bp = Blueprint('text', __name__, template_folder='templates')

class WebsocketDemo:
    def __init__(self, APPId, APISecret, APIKey, Text):
        self.appid = APPId
        self.apisecret = APISecret
        self.apikey = APIKey
        self.text = Text
        self.url = 'https://api.xf-yun.com/v1/private/s9a87e3ec'

    def sha256base64(self, data):
        sha256 = hashlib.sha256()
        sha256.update(data)
        digest = base64.b64encode(sha256.digest()).decode(encoding='utf-8')
        return digest

    def parse_url(self, request_url):
        stidx = request_url.index("://")
        host = request_url[stidx + 3:]
        schema = request_url[:stidx + 3]
        edidx = host.index("/")
        if edidx <= 0:
            raise Exception("invalid request url:" + request_url)
        path = host[edidx:]
        host = host[:edidx]
        u = (host, path, schema)
        return u

    def assemble_ws_auth_url(self, request_url, method="POST", api_key="", api_secret=""):
        host, path, schema = self.parse_url(request_url)
        now = datetime.now()
        date = format_date_time(mktime(now.timetuple()))
        signature_origin = f"host: {host}\ndate: {date}\n{method} {path} HTTP/1.1"
        signature_sha = hmac.new(api_secret.encode('utf-8'), signature_origin.encode('utf-8'), digestmod=hashlib.sha256).digest()
        signature_sha = base64.b64encode(signature_sha).decode(encoding='utf-8')
        authorization_origin = f'api_key="{api_key}", algorithm="hmac-sha256", headers="host date request-line", signature="{signature_sha}"'
        authorization = base64.b64encode(authorization_origin.encode('utf-8')).decode(encoding='utf-8')
        values = {"host": host, "date": date, "authorization": authorization}
        return f"{request_url}?{urlencode(values)}"

    def get_body(self):
        body = {
            "header": {
                "app_id": self.appid,
                "status": 3,
            },
            "parameter": {
                "s9a87e3ec": {
                    "result": {
                        "encoding": "utf8",
                        "compress": "raw",
                        "format": "json"
                    }
                }
            },
            "payload": {
                "input": {
                    "encoding": "utf8",
                    "compress": "raw",
                    "format": "plain",
                    "status": 3,
                    "text": base64.b64encode(self.text.encode("utf-8")).decode('utf-8')
                }
            }
        }
        return body

    def get_result(self):
        request_url = self.assemble_ws_auth_url(self.url, "POST", self.apikey, self.apisecret)
        headers = {'content-type': "application/json", 'host': 'api.xf-yun.com', 'app_id': self.appid}
        body = self.get_body()
        response = requests.post(request_url, data=json.dumps(body), headers=headers)
        tempResult = json.loads(response.content.decode())
        decoded_text = base64.b64decode(tempResult['payload']['result']['text']).decode()
        parsed_result = json.loads(decoded_text)
        suggestions = [item[2] for item in parsed_result['idm']]
        return suggestions

@text_bp.route('/')
def index():
    return render_template('text_index.html')

@text_bp.route('/process', methods=['POST'])
def process_text():
    text = request.form['text']
    demo = WebsocketDemo(APPId="c5274a8a", APISecret="OThlZmRjZWNkMjA4OWY1YWEyNTA4NjA3", APIKey="80c687d1f1bbc044a4ed41fb2180f7bd", Text=text)
    result = demo.get_result()
    return jsonify(result)
