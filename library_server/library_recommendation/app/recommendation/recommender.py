from bson import ObjectId
import pandas as pd
from app.recommendation.helper import load_model,  load_scaler, load_svd, load_vector_label
from ..extensions import db 

def recommend_books_rating(userId):
    model = load_model(userId,db["model_rating"])
    svd = load_svd(userId)
    scaler = load_scaler(userId)
    tfidf_vectorizer, label_encoder_genre,label_encoder_majors = load_vector_label()
    if (model is None or svd is None or scaler is None):
        raise Exception("Model not found")
    histories_df = pd.DataFrame(list(db['histories'].find({'user': ObjectId(userId),'status':1})))
    read_books = set(histories_df['book'].values) 
    books_df = pd.DataFrame(list(db['books'].find({'status':1})))
    # Lấy các sách chưa đọc
    unread_books_df = books_df[~books_df['_id'].isin(read_books)].copy()

    # Gán giá trị cho Genre_encoded mà không gây cảnh báo
    unread_books_df.loc[:, 'Genre_encoded'] = label_encoder_genre.transform(unread_books_df['genre'])
    unread_books_df.loc[:, 'Majors_encoded'] = label_encoder_majors.transform(unread_books_df['majors'])
    # Vector hóa summary cho các sách chưa đọc
    summary_tfidf = tfidf_vectorizer.transform(unread_books_df['summary'])  # Chuyển đổi tóm tắt cho sách chưa đọc
    
    # Giảm chiều dữ liệu TF-IDF bằng SVD đã huấn luyện trước
    summary_svd = svd.transform(summary_tfidf)  # Sử dụng SVD đã huấn luyện

    # Kết hợp các đặc trưng
    X_new = pd.concat([unread_books_df[['Genre_encoded']].reset_index(drop=True), unread_books_df[['Majors_encoded']].reset_index(drop=True),pd.DataFrame(summary_svd)], axis=1)

    X_new.columns = X_new.columns.astype(str)
    X_new_scaled = scaler.fit_transform(X_new)
    # Dự đoán cho các sách chưa đọc
    new_book_predictions = model.predict(X_new_scaled)
    
    # Tiến hành xử lý dự đoán
    unread_books_df['predicted_rating'] = new_book_predictions
    recommended_books = unread_books_df[unread_books_df['predicted_rating'] >=3 ]
    
    recommended_books = recommended_books.copy()
    # Loại bỏ các cột dư thừa  
    recommended_books[['_id','genre','majors']] = recommended_books[['_id','genre','majors']].astype(str)
    # Tạo dictionary để dễ truy vấn thông tin từ genres và majors
    genre_data = {str(genre['_id']): genre for genre in db['genres'].find()}
    major_data = {str(major['_id']): major for major in db['majors'].find()}
     # Lặp qua từng sách và chèn thông tin genre và major dưới dạng object
    
    recommended_books['genre'] = recommended_books['genre'].apply(lambda genre_id: genre_data.get(genre_id, {}))
    recommended_books['majors'] = recommended_books['majors'].apply(lambda major_id: major_data.get(major_id, {}))
    # Chuyển đổi _id trong genre_details và major_details thành str
    
    recommended_books['genre'] = recommended_books['genre'].apply(
        lambda details: {**details, '_id': str(details.get('_id', ''))}
    )
    recommended_books['majors'] = recommended_books['majors'].apply(
        lambda details: {**details, '_id': str(details.get('_id', ''))}
    )
    
    recommended_books = recommended_books.drop(columns=['Genre_encoded','Majors_encoded','contents','predicted_rating'], errors='ignore')  
    recommended_books = recommended_books.to_dict(orient='records')
    return recommended_books