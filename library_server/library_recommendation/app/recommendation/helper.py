# Lưu mô hình vào MongoDB
import pickle

from bson import Binary, ObjectId
import pandas as pd
from ..extensions import db 

def save_model(user_id, model, collection):
    model_bytes = pickle.dumps(model)
    collection.update_one(
        {"user_id":ObjectId(user_id)},
        {"$set": {"model": model_bytes}},
        upsert=True
    )
def save_model2(model):
    model_bytes = pickle.dumps(model)
    db['model_neighbors'].update_one(
        {"name":"model_neighbors"},
        {"$set": {"model": model_bytes}},
        upsert=True
    )
    
def load_model2():
    model_data = db['model_neighbors'].find_one({"name": "model_neighbors"})
    if model_data:
        return pickle.loads(model_data['model'])
    return None

def load_model(user_id,collection):
    model_data = collection.find_one({"user_id": ObjectId(user_id)})
    if model_data:
        return pickle.loads(model_data['model'])
    return None

def get_rating_for_user(userId, books_df):
    # Lấy lịch sử sách đã đọc của người dùng
    histories_df = pd.DataFrame(list(db['histories'].find({'user': ObjectId(userId),'status':1})))
    review_df = pd.DataFrame(list(db['reviews'].find({'user': ObjectId(userId)})))
    
    # Ghép lịch sử sách đã đọc với thông tin sách
    user_book_df = pd.merge(histories_df, books_df, left_on='book', right_on='_id')
    
    # Danh sách các thể loại đã đọc
    read_genres = set(user_book_df['genre'].values)
    
    # Lọc các sách có thể loại chưa đọc
    unread_genre_books_df = books_df[~books_df['genre'].isin(read_genres)]
    
    # Lấy mỗi thể loại chưa đọc một sách
    selected_books_unread = unread_genre_books_df.groupby('genre', group_keys=False).apply(lambda group: group.sample(1)).reset_index(drop=True)
    selected_books_unread = selected_books_unread[['title', 'genre', 'summary', 'Genre_encoded', 'Majors_encoded', '_id']].copy()
    # Gán rating = 0 cho sách chưa đọc
    selected_books_unread['rating'] = 0
    
    # Kiểm tra nếu có dữ liệu review thì thêm rating cho sách đã đọc
    if not review_df.empty:
        # Thêm rating cho sách đã đọc từ review (nếu có)
        user_book_df = pd.merge(user_book_df, review_df[['book', 'rating']], how='left', left_on='book', right_on='book')
    
    # Kiểm tra lại xem cột 'rating' có tồn tại hay không trong user_book_df
    if 'rating' not in user_book_df.columns:
        user_book_df['rating'] = 3  # Nếu không có cột rating, thêm vào với giá trị mặc định là 3
    
    # Gán rating = 3 cho sách đã đọc mà không có review
    user_book_df['rating'].fillna(3, inplace=True)
    
    # Chọn các cột cần thiết
    read_books_df = user_book_df[['title', 'genre', 'summary', 'Genre_encoded', 'Majors_encoded', 'rating']].copy()
    
    # Kết hợp sách đã đọc và sách từ thể loại chưa đọc
    combined_books = pd.concat([read_books_df, selected_books_unread], ignore_index=True)
    print(combined_books)
    return combined_books

def save_scaler(userId, scaler):
    # Serialize the scaler using pickle
    scaler_binary = Binary(pickle.dumps(scaler))
    # Save the scaler in the database
    db["scaler"].update_one(
        {'userId': userId},
        {'$set': {'scaler': scaler_binary}},
        upsert=True  # Create a new document if one doesn't exist
    )

def load_scaler(userId):
    # Load the scaler from the database
    scaler_document =  db["scaler"].find_one({'userId': userId})
    if scaler_document and 'scaler' in scaler_document:
        # Deserialize the scaler
        return pickle.loads(scaler_document['scaler'])
    return None

def save_svd(userId, svd):
    # Serialize the SVD model using pickle
    svd_binary = Binary(pickle.dumps(svd))
    # Save the SVD model in the database
    db["svd"].update_one(
        {'userId': userId},
        {'$set': {'svd': svd_binary}},
        upsert=True  # Create a new document if one doesn't exist
    )

def load_svd(userId):
    # Load the SVD model from the database
    svd_document = db["svd"].find_one({'userId': userId})
    if svd_document and 'svd' in svd_document:
        # Deserialize the SVD model
        return pickle.loads(svd_document['svd'])
    return None

def save_vector_label(tfidf_vectorizer, label_encoder_genre, label_encoder_majors):
    # Tuần tự hóa các biến
    tfidf_vectorizer_serialized = pickle.dumps(tfidf_vectorizer)
    label_encoder_genre_serialized = pickle.dumps(label_encoder_genre)
    label_encoder_majors_serialized = pickle.dumps(label_encoder_majors)
    # Lưu các document vào MongoDB
    db["df"].replace_one(
        {'name': 'tfidf_vectorizer'},
        {'name': 'tfidf_vectorizer', 'model': tfidf_vectorizer_serialized},
        upsert=True
    )
    db["df"].replace_one(
        {'name': 'label_encoder_genre'},
        {'name': 'label_encoder_genre', 'model': label_encoder_genre_serialized},
        upsert=True
    )
    db["df"].replace_one(
        {'name': 'label_encoder_majors'},
        {'name': 'label_encoder_majors', 'model': label_encoder_majors_serialized},
        upsert=True
    )
    
def load_vector_label():
    # Tải các model từ MongoDB
    tfidf_vectorizer_data = db["df"].find_one({'name': 'tfidf_vectorizer'})['model']
    label_encoder_genre_data = db["df"].find_one({'name': 'label_encoder_genre'})['model']
    label_encoder_majors_data = db["df"].find_one({'name': 'label_encoder_majors'})['model']
    # Giải tuần tự hóa
    tfidf_vectorizer = pickle.loads(tfidf_vectorizer_data)
    label_encoder_genre = pickle.loads(label_encoder_genre_data)
    label_encoder_majors = pickle.loads(label_encoder_majors_data)
    return tfidf_vectorizer, label_encoder_genre, label_encoder_majors

