# import necessary libraries
import json
from bson import json_util, ObjectId
from flask import Flask, render_template, jsonify, redirect, url_for, request, session, Response
from flask_pymongo import PyMongo

from .config import MONGO_URI, SECRET_KEY
from .session_class import ItsDangerousSessionInterface
from .omdb import (
    omdb_search,
    to_snake_case,
    title_dict,
    insert_or_not,
    JSONEncoder,
    get_by_imdb_id,
    insert_or_update_movie_user,
)

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


@app.route("/login", methods=['POST',])
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


# /send_form2 is for registering a new user and updating MongoDB
# this lives on the index for simplicity
@app.route("/register", methods=['POST',])
def send_form2():
    if request.method == 'POST':
        users = mongo.db.users
        new_email = request.form['new_email']
        password1 = request.form['password1']
        password2 = request.form['password2']
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        screen_name = request.form['screen_name']
        group = 'Bingers'
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
                    users.insert({
                        'email': new_email,
                        'pwd': password,
                        'first_name': first_name,
                        'last_name': last_name,
                        'screen_name': screen_name,
                        'groups': group,
                        'genres': genre,
                        'gender': gender
                    })
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
    # if user is not logged in, redirect him to the login page
    try:
        session['user_id']
    except KeyError:
        return redirect('/')

    # just render the HTML page
    return render_template(
        "shows.html",
        first_name=session['user_first_name'],
        last_name=session['user_last_name'],
        user_id=session['user_id']
    )


@app.route("/shows/data/mine")
def shows_data_mine():
    # if user is not logged in, redirect him to the login page
    try:
        session['user_id']
    except KeyError:
        return redirect('/')

    # find the movies for the current logged in user
    show_list = mongo.db.shows_user.find({'user': ObjectId(session['user_id'])})

    data_list = []
    for show in show_list:
        # fetch the movie info for every movie in user database
        movie_obj = mongo.db.shows_omdb.find_one({'_id': show['movie']})
        # make the list for returning JSON
        data_list.append({
            'movie': movie_obj,
            'user': show
        })

    # parse / convert to JSON
    show_json = json.loads(json_util.dumps(data_list))
    # render the JSON
    return jsonify(show_json)


# JSON output of MongoDB to hold the shows data
# this is called by app_shows.js
@app.route("/shows/data")
def shows_data():
    # find all movies sorted by their title
    movies = mongo.db.shows_omdb.find().sort('title')
    # convert them into JSON
    movies = json.loads(json_util.dumps(movies))
    # render the JSON
    return jsonify(movies)


@app.route("/show_add")
def show_add():
    # if user is not logged in, redirect him to the login page
    try:
        session['user_id']
    except KeyError:
        return redirect('/')

    return render_template(
        'show_add.html',
        first_name=session['user_first_name'],
        last_name=session['user_last_name'],
        user_id=session['user_id']
    )


@app.route("/show/add/mine", methods=['POST', ])
def show_add_mine():
    # if user is not logged in, redirect him to the login page
    try:
        session['user_id']
    except KeyError:
        return json.dumps({
            'success': False,
            'message': 'Login First'
        })

    # get the request params
    imdb_id = request.form.get('imdb_id')
    bingeworthy = request.form.get('bingeworthy')
    rating = request.form.get('rating')

    # get the movie data from OMDB
    data = get_by_imdb_id(imdb_id)
    # insert or update the movie to our database
    movie_id = insert_or_not(mongo, data)

    # now save the movie rating
    insert_or_update_movie_user(mongo, {
        'movie': movie_id,
        'user': ObjectId(session['user_id']),
        'bingeworthy': bingeworthy,
        'rating': float(rating)
    })

    # success message
    return json.dumps({
        'success': True,
        'message': 'Added Successfully'
    })


# this is the endpoint where graph data are returned
@app.route("/graph/data", methods=['POST', ])
def graph_data():
    # if user is not logged in, redirect to the login page
    try:
        session['user_id']
    except KeyError:
        return json.dumps({
            'success': False,
            'message': 'Login First'
        })

    # get the movie id from the request
    movie_id = ObjectId(request.form.get('id'))

    # find my rating from database
    my_rating = mongo.db.shows_user.find_one({'movie': movie_id, 'user': ObjectId(session['user_id'])})

    # let's count the other user rating / bingers' ratings'
    other_rating = 0.1  # let it be 0.1 so that something is shown at least
    count = 0  # initially zero
    for item in mongo.db.shows_user.find({'movie': movie_id, 'user': {'$not': {'$eq': ObjectId(session['user_id'])}}}):
        # make the average this way because it is faster for now
        other_rating += item['rating']
        count += 1

    # if nothing is found in DB fix the division by zero error
    count = 1 if count == 0 else count
    # return the data
    return json.dumps({
        'success': True,
        'mine': my_rating,
        'others': {'pop': other_rating / count}
    }, cls=JSONEncoder)  # use this JSON Encoder class to avoid Mongo's object id


@app.route("/show_add_form", methods=['POST','GET', ])
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

        return json.dumps(search, cls=JSONEncoder)

    return json.dumps({'success': False})


# this page will display show_add data from shows_temp collection
@app.route("/show_add/data")
def show_data_temp():
    shows_temp = mongo.db.shows_temp.find()
    shows_temp = json.loads(json_util.dumps(shows_temp))
    return jsonify(shows_temp)


@app.route("/user_shows")
def user_shows():
    try:
        session['user_id']
    except KeyError:
        return redirect('/')

    return render_template(
        "user_shows.html",
        first_name=session['user_first_name'],
        last_name=session['user_last_name'],
        user_id=session['user_id']
    )


# this page displays user data. Used only for testing of MongoDB
@app.route("/users/data")
def users_data():
    users = mongo.db.users.find()
    print(users)
    users = json.loads(json_util.dumps(users))
    return jsonify(users)


# --------------- Visualization Section ---------------
# --------------- first visualization page ---------------
@app.route("/binge_vis")
def visualize():
    # if the user is not logged in, redirect him to the login page
    try:
        session['user_id']
    except KeyError:
        return redirect('/')

    # just render the HTML page
    return render_template('binge_vis.html')


# create a json data page with show titles
@app.route("/titles")
def titles():
    """Return a list of sample titles."""
    # shows = mongo.db.shows_omdb.distinct('title').sort('title', 1)
    shows = mongo.db.shows_omdb.find().distinct('title')
    shows = json.loads(json_util.dumps(shows))
    return jsonify(shows)


# take the value of <sample> from html selection build data page with show attributes
@app.route("/show_attributes/<sample>")
def sample_metadata(sample):
    show = mongo.db.shows_omdb.find_one({'title':sample})
    show = json.loads(json_util.dumps(shows))
    return jsonify(show)


# This uses secret key to connect
# if __name___ == "__main__":
#     app.secret_key = "mysecret"
#     app.run(debug=true)

# the is the standard flask connection
if __name__ == "__main__":
    app.run(debug=True)
