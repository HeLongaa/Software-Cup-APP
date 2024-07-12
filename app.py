# app.py
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from chat import SparkApi
from ocr.routes import ocr_bp
from translation.routes import translate_bp  # 导入新的蓝图
from ppt.routes import ppt_bp
from chat.routes import chat_bp, appid, api_key, api_secret, Spark_url, domain
import logging

logging.getLogger('werkzeug').disabled = True

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app)

app.register_blueprint(ocr_bp, url_prefix='/ocr')
app.register_blueprint(translate_bp, url_prefix='/translate')  # 注册新的蓝图
app.register_blueprint(ppt_bp, url_prefix='/ppt')
app.register_blueprint(chat_bp, url_prefix='/chat')

@app.route('/')
def index():
    return render_template('tool-main.html')

@app.route('/tool')
def tool():
    return render_template('Tools.html')

@app.route('/tool-main')
def toolmain():
    return render_template('tool-main.html')

@socketio.on('message')
def handle_message(data):
    question = data['question']
    SparkApi.answer = ""
    text = [{"role": "user", "content": question}]

    def process_response(content, is_complete=False):
        if is_complete:
            emit('complete')
        else:
            emit('response', {'content': content})

    SparkApi.main(appid, api_key, api_secret, Spark_url, domain, text, process_response)

if __name__ == '__main__':
    socketio.run(app, allow_unsafe_werkzeug=True)
