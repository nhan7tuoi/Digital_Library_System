import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import LabelEncoder
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfVectorizer
from app.recommendation.helper import get_rating_for_user, load_model, save_model, save_scaler, save_svd, save_vector_label
from ...extensions import db 

def create_rating_model(userId):
    genres_df = pd.DataFrame(list(db['genres'].find({},{'_id':1})))
    majors_df = pd.DataFrame(list(db['majors'].find({},{'_id':1})))
    books_df = pd.DataFrame(list(db['books'].find({'status':1})))
    tfidf_vectorizer = TfidfVectorizer(max_features=500)
    label_encoder_genre = LabelEncoder()
    label_encoder_majors = LabelEncoder()
    genres_df['Genre_encoded'] = label_encoder_genre.fit_transform(genres_df['_id'])
    majors_df['Majors_encoded'] = label_encoder_majors.fit_transform(majors_df['_id'])
    books_df['Genre_encoded'] = label_encoder_genre.transform(books_df['genre'])
    books_df['Majors_encoded'] = label_encoder_majors.transform(books_df['majors'])
    tfidf_vectorizer.fit(books_df['summary'])
    
    df = get_rating_for_user(userId,books_df)
    X_genres = df[['Genre_encoded']]
    X_majors = df[['Majors_encoded']]
    summary_tfidf = tfidf_vectorizer.transform(df['summary'])
    svd = TruncatedSVD(n_components=100)
    summary_svd = svd.fit_transform(summary_tfidf)
    # Kết hợp các đặc trưng
    X = pd.concat([X_genres.reset_index(drop=True),X_majors.reset_index(drop=True), pd.DataFrame(summary_svd)], axis=1)
    X.columns = X.columns.astype(str)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    y = df['rating']
    model = load_model(userId,db["model_rating"])
    
    if model is None:
        model = RandomForestClassifier()

    model.fit(X_scaled, y)
    save_scaler(userId,scaler)
    save_model(userId, model,db["model_rating"])
    save_svd(userId, svd)
    save_vector_label(tfidf_vectorizer,label_encoder_genre,label_encoder_majors)
    

    
