# # import necessary libraries
# import json
# from bson import json_util, ObjectId
# from flask import Flask, render_template, jsonify, redirect, url_for, request, session, Response
# from flask_pymongo import PyMongo

# from .config import MONGO_URI, SECRET_KEY
# from .session_class import ItsDangerousSessionInterface
# from .omdb import (
#     omdb_search,
#     to_snake_case,
#     title_dict,
#     insert_or_not,
#     JSONEncoder,
#     get_by_imdb_id,
#     insert_or_update_movie_user,
# )

# app = Flask(__name__)

# # Use flask_pymongo to set up mongo connection
# # app.config['MONGODB_NAME'] = bingeworthy_db
# app.config["MONGO_URI"] = MONGO_URI
# mongo = PyMongo(app)

# app.session_interface = ItsDangerousSessionInterface()
# app.secret_key = SECRET_KEY

# shows=mongo.db.shows_omdb.find()

# @app.route("/titles")
# def titles():
#     """Return a list of sample titles."""
#     shows = mongo.db.shows_omdb.find()
#     shows = json.loads(json_util.dumps(shows))
#     return jsonify(shows)












# # the is the standard flask connection
# if __name__ == "__main__":
#     app.run(debug=True)
