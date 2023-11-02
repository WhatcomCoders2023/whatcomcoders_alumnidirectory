import json
import collections

collections.Iterable = collections.abc.Iterable

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask.wrappers import Response
from flask.globals import request, session

from app.services import  jwt_manager, firestore_db, logger_manager

bp = Blueprint("user", __name__)

@bp.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    return jsonify({"message": "This is a protected route"})

# @bp.route('/current_user', methods=['GET'])
# @jwt_required()
# def get_current_user():
#     current_user = get_jwt_identity()
#     return jsonify(logged_in_as=current_user)


@bp.route("/api/user/<email>", methods=["GET"])
def get_user_data(email):
    user_data = firestore_db.get_user_data_by_email(email)
    if user_data.exists:
        return jsonify(user_data.to_dict())
    else:
        return jsonify({"error": "User not found"}), 404
    
@bp.route("/api/people", methods=["GET"])
def get_all_users():
    users_list = firestore_db.get_all_users()

    print(jsonify(users_list))
    return jsonify(users_list)

@bp.route("/api/people/update", methods=["POST"])
def update_user_info():
    data = request.json
    firestore_db.update_user_info(data)
    return jsonify({"message": "User updated successfully"})

@bp.route("/api/current_user", methods=["GET"])
@jwt_required()
def current_user():
    current_user_email = get_jwt_identity()
    user_data = firestore_db.get_user_data_by_email(current_user_email) 
    return jsonify(name=user_data['name'])

@bp.route("/api/user", methods=["GET"])
@jwt_required()
def get_user():
    current_user_email = get_jwt_identity()
    logger_manager.logger.debug("current_user_email", current_user_email)
    user_data = firestore_db.get_user_data_by_email(current_user_email) 
    return jsonify(user_data)

@jwt_manager.invalid_token_loader
def invalid_token_callback(error):
    logger_manager.logger.error(f"Invalid token: {error}")
    return jsonify({
        'message': 'Invalid token.',
        'error': str(error)
    }), 422