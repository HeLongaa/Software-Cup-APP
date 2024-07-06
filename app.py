from flask import Flask, render_template
from ocr.routes import ocr_bp
from text_processing.routes import text_bp
from chat.routes import chat_bp
from ppt.routes import ppt_bp

app = Flask(__name__)

app.register_blueprint(ocr_bp, url_prefix='/ocr')
app.register_blueprint(text_bp, url_prefix='/text')
app.register_blueprint(chat_bp, url_prefix='/chat')
app.register_blueprint(ppt_bp, url_prefix='/ppt')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
