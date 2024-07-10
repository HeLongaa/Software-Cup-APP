from flask import Blueprint, render_template, request, Flask
from flask_socketio import emit, SocketIO
import chat.SparkApi as SparkApi

chat_bp = Blueprint('chat', __name__, template_folder="templates")


appid = "2d2fc3e9"
api_secret = "NDQwZWJhNGU2MmNlOWJkOGQxYjI2ZTNi"
api_key = "f8930205f626138a4882b8d4e01a923b"
domain = "generalv3.5"
Spark_url = "wss://spark-api.xf-yun.com/v3.5/chat"

@chat_bp.route('/')
def index():
    return render_template('chat_index.html')


