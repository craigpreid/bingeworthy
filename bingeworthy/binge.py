# import necessary libraries
import json
from bson import json_util, ObjectId
from flask import Flask, render_template, jsonify, redirect, url_for, request, session, Response
from flask_pymongo import PyMongo
import requests
import re

# from flask_bcrypt import bcrypt
# from flask.ext.pymongo import PyMongo

from .config import tmdb_api, omdb_api, MONGO_URI, SECRET_KEY  ## tmdb API Key = tmdb_api  ## omdb API key = omdb_api
from .session_class import ItsDangerousSessionInterface
from .omdb import omdb_search, to_snake_case, title_dict, insert_or_not, JSONEncoder

app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
# app.config['MONGODB_NAME'] = bingeworthy_db
app.config["MONGO_URI"] = MONGO_URI
mongo = PyMongo(app)

app.session_interface = ItsDangerousSessionInterface()
app.secret_key = SECRET_KEY


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/send_form1", methods=['POST', 'GET'])
def send():
    if request.method == 'POST':
        users = mongo.db.users

        # note: email == username as well as email
        # store all the form values as variables
        email = request.form['email']
        password = request.form['password']

        # check for login first. There are many combinations, but 
        # for now let's just test if we have a simple login name 
        # and password
        if email and password:
            existing_user = users.find_one({'email': email})
            if existing_user:
                if password == existing_user['pwd']:
                    # put the user id into the session
                    session['user_id'] = str(existing_user['_id'])
                    session['user_email'] = existing_user['email']
                    session['user_first_name'] = existing_user['first_name']
                    session['user_last_name'] = existing_user['last_name']
                    return redirect('/shows')
                else:
                    return "Invalid username or password"
            else:
                return "That username is not registered"
        else:
            return "Invalid password / Username combination"
    else:
        return redirect("/")


# /send_form2 is for regsitering a new user and updating MongoDB
# this lives on the index for simplicity
@app.route("/send_form2", methods=['POST', 'GET'])
def send_form2():
    if request.method == 'POST':
        users = mongo.db.users
        new_email = request.form['new_email']
        password1 = request.form['password1']
        password2 = request.form['password2']
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        screen_name = request.form['screen_name']
        group = request.form['group']
        genre = request.form['genre']
        gender = request.form['gender']

        # first step make sure all the fields are filled in
        if new_email and password1 and password2:
            existing_user = users.find_one({'email': new_email})

            # if this the username/email is take then stop
            if existing_user:
                return "That username already exists"

            # if the username is not in use
            else:
                # verify that both passwords match
                if password1 == password2:
                    # storing the bcrypt method below for future. bcrypt is not working.
                    # password = bcrypt.hashpw(request.form['password1'].encode('utf-8') , bcrypt.gensalt()) #bcrypt not working
                    password = password1
                    users.insert({'email': new_email, 'pwd': password, 'first_name': first_name, \
                                  "last_name": last_name, 'screen_name': screen_name, 'groups': group, \
                                  'genres': genre, 'gender': gender})
                    return redirect('/shows')
                else:
                    return "Passwords don't match"
        else:
            return "Please fill in all the fields"
    else:
        return redirect("/")


# set shows.html to display shows that people are watching
# this contains a list of all shows
@app.route("/shows")
def shows():
    return render_template(
        "shows.html",
        first_name=session['user_first_name'],
        last_name=session['user_last_name']
    )


# JSON output of MongoDB to hold the shows data
# this is called by app_shows.js
@app.route("/shows/data")
def shows_data():
    shows = mongo.db.shows_omdb.find()
    print(shows)
    shows = json.loads(json_util.dumps(shows))
    return jsonify(shows)


@app.route("/show_add")
def show_add():
    return render_template(
        'show_add.html',
        first_name=session['user_first_name'],
        last_name=session['user_last_name']
    )


@app.route("/show_add_form", methods=['POST','GET'])
def show_add_form():
    if request.method == 'POST':
        title = request.form['title']
        show_type = request.form['show_type']
        year = request.form['year']
        specific = True if request.form.get('specific') else False
        general = True if request.form.get('general') else False

        if not title:
            return "You need to enter a title"

        # if title search specific = True, general search specific is false
        # enter the search parameters
        search = omdb_search(title, show_type, year, specific)

        # empty array to store the values from search
        shows_list = []

        # in the case of title search, use title_dict function
        if specific:
            search = title_dict(search)
            for item in search:
                shows_list.append({to_snake_case(k): v for k, v in item.items()})
        # in the case of general search, the return values are in an array
        else:
            for item in search['Search']:
                shows_list.append({to_snake_case(k): v for k, v in item.items()})

        # store the shows info in a temporary collection
        # first clear the collection of any data
        # shows_temp = mongo.db.shows_temp
        # shows_temp.drop()
        # slightly different process to update title v. search
        if specific:
            insert_or_not(mongo, shows_list['title'], shows_list['year'], shows_list)
            # shows_temp.insert(shows_list)
        else:
            for show_item in shows_list:
                insert_or_not(mongo, show_item['title'], show_item['year'], show_item)
                # shows_temp.insert(show_item)
        # Refresh for more entries
        # jQuery from shows will fetch data from show_add/data page
        return json.dumps(shows_list, cls=JSONEncoder)

    return json.dumps({'success': False})


# this page will display show_add data from shows_temp collection
@app.route("/show_add/data")
def show_data_temp():
    shows_temp = mongo.db.shows_temp.find()
    shows_temp = json.loads(json_util.dumps(shows_temp))
    return jsonify(shows_temp)


# this page displays user data. Used only for testing of MongoDB
@app.route("/users/data")
def users_data():
    users = mongo.db.users.find()
    print(users)
    users = json.loads(json_util.dumps(users))
    return jsonify(users)


# This uses secret key to connect
# if __name___ == "__main__":
#     app.secret_key = "mysecret"
#     app.run(debug=true)

# the is the standard flask connection
if __name__ == "__main__":
    app.run(debug=True)
