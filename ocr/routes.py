from flask import Blueprint, request, render_template, jsonify
import os
import base64
import hashlib
import time
import requests
import json
from config import configurations

ocr_bp = Blueprint('ocr', __name__, template_folder='templates')

config = configurations["config_ocr"]
OCR_URL = config['ocr_url']
OCR_APPID = config['appid']
OCR_API_KEY = config['api_key']

def get_ocr_header():
    curTime = str(int(time.time()))
    param = "{\"language\":\"en\",\"location\":\"true\"}"
    paramBase64 = base64.b64encode(param.encode('utf-8'))
    m2 = hashlib.md5()
    str1 = OCR_API_KEY + curTime + str(paramBase64, 'utf-8')
    m2.update(str1.encode('utf-8'))
    checkSum = m2.hexdigest()
    header = {
        'X-CurTime': curTime,
        'X-Param': paramBase64,
        'X-Appid': OCR_APPID,
        'X-CheckSum': checkSum,
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    }
    return header

def get_ocr_body(filepath):
    with open(filepath, 'rb') as f:
        imgfile = f.read()
    data = {'image': str(base64.b64encode(imgfile), 'utf-8')}
    return data

@ocr_bp.route('/')
def index():
    return render_template('ocr_index.html')

@ocr_bp.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    if file:
        upload_folder = 'uploads'
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        filepath = os.path.join(upload_folder, file.filename)
        file.save(filepath)

        response = requests.post(OCR_URL, headers=get_ocr_header(), data=get_ocr_body(filepath))
        response_data = json.loads(response.content)

        if response_data['code'] == '0':
            blocks = response_data['data']['block']
            recognized_text_lines = []
            for block in blocks:
                for line in block['line']:
                    line_text = ""
                    for word in line['word']:
                        line_text += word['content'] + " "
                    recognized_text_lines.append(line_text.strip())
            return jsonify({'text': recognized_text_lines})
        else:
            return jsonify({'error': response_data['desc']})
