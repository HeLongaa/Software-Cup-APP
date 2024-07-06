from flask import Blueprint, request, jsonify, render_template
import base64
import hashlib
import hmac
import json
import requests
import time

ppt_bp = Blueprint('ppt', __name__, template_folder='templates')

class AIPPT:
    def __init__(self, app_id, api_secret, text, theme='auto', is_card_note=False):
        self.app_id = app_id
        self.api_secret = api_secret
        self.text = text
        self.header = {}
        self.theme = theme
        self.is_card_note = is_card_note

    def get_signature(self, ts):
        try:
            auth = self.md5(self.app_id + str(ts))
            return self.hmac_sha1_encrypt(auth, self.api_secret)
        except Exception as e:
            print(e)
            return None

    def hmac_sha1_encrypt(self, encrypt_text, encrypt_key):
        return base64.b64encode(
            hmac.new(encrypt_key.encode('utf-8'), encrypt_text.encode('utf-8'), hashlib.sha1).digest()).decode('utf-8')

    def md5(self, text):
        return hashlib.md5(text.encode('utf-8')).hexdigest()

    def create_task(self):
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
        return {"query": text}

    def get_process(self, sid):
        if sid:
            response = requests.get(f"https://zwapi.xfyun.cn/api/aippt/progress?sid={sid}", headers=self.header).json()
            return response
        else:
            return None

    def get_result(self):
        task_id = self.create_task()
        while True:
            response = self.get_process(task_id)
            if response and response['data']['process'] == 100:
                return response['data']['pptUrl']
            time.sleep(5)

@ppt_bp.route('/')
def index():
    return render_template('ppt_index.html')

@ppt_bp.route('/generate_ppt', methods=['POST'])
def generate_ppt():
    user_input = request.form['message']
    theme_select = request.form.get('theme', 'auto')
    is_card_note_select = request.form.get('is_card_note') == 'true'
    ppt_generator = AIPPT(app_id="fc25885c", api_secret="YzJlMjIxMDc1YmY3NzFiMTRjNGFlYmQx", text=user_input, theme=theme_select, is_card_note=is_card_note_select)
    ppt_url = ppt_generator.get_result()
    return jsonify({"ppt_url": ppt_url})
