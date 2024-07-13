from flask import Blueprint

manage_bp = Blueprint('manage', __name__, template_folder='templates', static_folder='static')

from . import routes
