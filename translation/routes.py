# translation/routes.py
from flask import Blueprint, render_template, request, jsonify
from datetime import datetime
from wsgiref.handlers import format_date_time
from time import mktime
import hashlib
import base64
import hmac
from urllib.parse import urlencode
import json
import requests

translate_bp = Blueprint('translate_bp', __name__)

APPId = "c5274a8a"
APISecret = "OThlZmRjZWNkMjA4OWY1YWEyNTA4NjA3"
APIKey = "80c687d1f1bbc044a4ed41fb2180f7bd"
RES_ID = "its_en_cn_word"


class AssembleHeaderException(Exception):
    def __init__(self, msg):
        self.message = msg


class Url:
    def __init__(self, host, path, schema):
        self.host = host
        self.path = path
        self.schema = schema


def sha256base64(data):
    sha256 = hashlib.sha256()
    sha256.update(data)
    digest = base64.b64encode(sha256.digest()).decode('utf-8')
    return digest


def parse_url(requset_url):
    stidx = requset_url.index("://")
    host = requset_url[stidx + 3:]
    schema = requset_url[:stidx + 3]
    edidx = host.index("/")
    if edidx <= 0:
        raise AssembleHeaderException("invalid request url:" + requset_url)
    path = host[edidx:]
    host = host[:edidx]
    u = Url(host, path, schema)
    return u


def assemble_ws_auth_url(requset_url, method="POST", api_key="", api_secret=""):
    u = parse_url(requset_url)
    host = u.host
    path = u.path
    now = datetime.now()
    date = format_date_time(mktime(now.timetuple()))
    signature_origin = "host: {}\ndate: {}\n{} {} HTTP/1.1".format(host, date, method, path)
    signature_sha = hmac.new(api_secret.encode('utf-8'), signature_origin.encode('utf-8'),
                             digestmod=hashlib.sha256).digest()
    signature_sha = base64.b64encode(signature_sha).decode(encoding='utf-8')
    authorization_origin = "api_key=\"%s\", algorithm=\"%s\", headers=\"%s\", signature=\"%s\"" % (
        api_key, "hmac-sha256", "host date request-line", signature_sha)
    authorization = base64.b64encode(authorization_origin.encode('utf-8')).decode(encoding='utf-8')
    values = {
        "host": host,
        "date": date,
        "authorization": authorization
    }

    return requset_url + "?" + urlencode(values)


@translate_bp.route('/translate', methods=['GET', 'POST'])
def translate():
    if request.method == 'POST':
        text_to_translate = request.form['text']

        url = 'https://itrans.xf-yun.com/v1/its'

        body = {
            "header": {
                "app_id": APPId,
                "status": 3,
                "res_id": RES_ID
            },
            "parameter": {
                "its": {
                    "from": "cn",
                    "to": "en",
                    "result": {}
                }
            },
            "payload": {
                "input_data": {
                    "encoding": "utf8",
                    "status": 3,
                    "text": base64.b64encode(text_to_translate.encode("utf-8")).decode('utf-8')
                }
            }
        }

        request_url = assemble_ws_auth_url(url, "POST", APIKey, APISecret)

        headers = {'content-type': "application/json", 'host': 'itrans.xf-yun.com', 'app_id': APPId}

        response = requests.post(request_url, data=json.dumps(body), headers=headers)
        tempResult = json.loads(response.content.decode())

        decoded_text = base64.b64decode(tempResult['payload']['result']['text']).decode()
        translation_result = json.loads(decoded_text)

        translated_text = translation_result['trans_result']['dst']
        return jsonify({'translated_text': translated_text})

    return render_template('translate.html')
