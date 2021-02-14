from flask import Flask
from flask_cors import CORS
from .config import config_by_name
from .views import bmarker
from .db_config import mongo, jwt


def create_app(config_name):
    app = Flask(__name__)
    cors = CORS(app)
    app.config.from_object(config_by_name[config_name])
    app.register_blueprint(
        bmarker,
        url_prefix='/bmarker'
    )
    mongo.init_app(app)
    jwt.init_app(app)
    return app
