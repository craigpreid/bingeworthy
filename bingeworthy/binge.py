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
    return render_template('show_add.html',

        first_name=session['user_first_name'],
        last_name=session['user_last_name']
    )


@app.route("/show_add_form", methods=['POST','GET'])
def show_add_form():
    if request.method == 'POST':
        title = request.form['title']
        show_type = request.form['show_type']
        year = request.form['year']
        # specific/general refer to checkbox for title search or general search
        # the title search has more detailed information 
        # we will use title searches to populate MongoDB
        specific = request.form.get['specific']
        # general = request.form['general']

        if title == False:
            return "You need to enter a title"
        else:
            def omdb_search(title, show_type, year, specific):
                omdb_url = "http://www.omdbapi.com/?i=tt3896198&apikey=" + omdb_api
                title = title.split(' ')
                title='+'.join(title)
                
                # the title search
                if specific: 
                    title = '&t=' + title
                
                # OMDB calls this just a search
                else:
                    title = "&s=" + title
                show_type = '&type=' + show_type
                year = '&y=' + year
                
                # fetch data from the OMDB API, return results
                omdb_url = omdb_url + title + show_type + year
                omdb_data = requests.get(omdb_url)
                omdb_url = omdb_data.url
                omdb_data=omdb_data.json()
                return(omdb_data)

            # function to convert keys from dictionary to lower case
            # we want to standardize MongoDB to lower case for keys
            def to_snake_case(name):
                s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
                return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

            # in the case of the title (specific) search, OMDB returns a
            # dictionary which we need to transform to an array to run the
            # snake case function. Also convert writers & actors to array
            def title_dict(search):
                array = []
                for item in search:
                    array.append({item: search[item]})
                array[7]['Writer']=array[7]['Writer'].split(' ')
                array[8]['Actors']=array[8]['Actors'].split(' ')
                return(array)

            # if title search specific = True, general search specific is false
            specific = True #temporarily hard coded until we verify checkbox

            # enter the search parameters
            search = omdb_search("title", "show_type", "year", specific)

            # empty array to store the values from search
            shows = []

            # in the case of title search, use title_dict function
            if specific == True:
                search = title_dict(search)
                for item in search:
                    shows.append({to_snake_case(k): v for k, v in item.items()})
            # in the case of general search, the return values are in an array
            else: 
                search = search
                for item in search['Search']:
                    shows.append({to_snake_case(k): v for k, v in item.items()})

            # store the shows info in a temporary collection
            # first clear the collection of any data
            shows_temp = mongo.db.shows_temp
            shows_temp.drop()
            # slightly different process to update title v. search
            if specific:
                shows_temp.insert(shows)
            else: 
                for i in range(len(shows)):
                    shows_temp.insert(shows[i])
            # Refresh for more entries 
            # jQuery from shows will fetch data from show_add/data page 
            return render_template("/show_add")
    else:
        return render_template("/show_add")


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
