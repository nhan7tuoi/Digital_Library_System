from flask import Blueprint, jsonify, request

from app.recommendation.recommender import  recommend_books_rating 
from app.recommendation.model.ratingModel import create_rating_model

bp = Blueprint('recommend', __name__, url_prefix='/api/v1/recommend')

    
@bp.route('/create_model_rating', methods=['POST'])
def update_or_create_model_rating():
    data = request.json
    userId = data.get('userId')
    print("a",userId)
    create_rating_model(userId)
    return jsonify({"message": "User model updated or created successfully!"}), 200

@bp.route('/recommend_books_rating/<user_id>', methods=['GET'])
def recommend_rating_books_route(user_id):
    print("b",user_id)
    try:
        recommendations = recommend_books_rating(user_id)
        return jsonify(recommendations), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 404