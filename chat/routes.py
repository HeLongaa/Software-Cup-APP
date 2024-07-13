from flask import Blueprint, render_template
from config import configurations

chat_bp = Blueprint('chat', __name__, template_folder="templates")

config = configurations["config_chat"]
appid = config["appid"]
api_secret = config["api_secret"]
api_key = config["api_key"]
domain = config["domain"]
Spark_url = config["chat_url"]


@chat_bp.route('/')
def index():
    return render_template('chat_index.html')
