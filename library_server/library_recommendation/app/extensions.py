from pymongo import MongoClient
from .config import Config

# Khởi tạo MongoClient
mongo_client = MongoClient(Config.MONGO_URI)
db = mongo_client.get_database('test') # Lấy database từ URI đã cấu hình

