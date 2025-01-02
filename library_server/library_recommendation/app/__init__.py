from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db  # Chỉ cần import db
from .routes import recommendation_route

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Khởi tạo CORS
    CORS(app)


    app.register_blueprint(recommendation_route.bp)

    return app
