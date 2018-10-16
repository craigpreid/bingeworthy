# import necessary libraries
from flask import Flask, render_template, jsonify, redirect, url_for, request, session, Response
from flask_pymongo import PyMongo
from bson import json_util, ObjectId
import json
# from flask_bcrypt import bcrypt
# from flask.ext.pymongo import PyMongo

app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
# app.config['MONGODB_NAME'] = bingeworthy_db
app.config["MONGO_URI"] = "mongodb://localhost:27017/bingeworthy_db"
mongo = PyMongo(app)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/send_form1", methods=['POST','GET'])
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
            existing_user = users.find_one({'email' : email})
            if existing_user:
                if password == existing_user['pwd']:
                    return redirect('/shows')
                else:
                    return "Invalid username or password"
            else:
                return "That username is not registered"
        else:
            return "Invalid password / Username combination"
    else:
        return redirect("/")

@app.route("/send_form2", methods=['POST','GET'])
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
            existing_user = users.find_one({'email' : new_email})

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
                    "last_name": last_name, 'screen_name':screen_name, 'groups': group,\
                    'genres': genre, 'gender': gender})
                    return redirect('/shows')
                else:
                    return "Passwords don't match"
        else:
            return "Please fill in all the fields"
    else:
        return redirect("/")

@app.route("/shows")
def shows():
    return render_template ("shows.html")

@app.route("/shows/data")
def shows_data():
    shows = mongo.db.shows_omdb.find()
    print(shows)
    shows = json.loads(json_util.dumps(shows))
    return jsonify(shows)


# This uses secret key to connect
# if __name___ == "__main__":
#     app.secret_key = "mysecret"
#     app.run(debug=true)

# the is the standard flask connection
if __name__ == "__main__":
    app.run(debug=True)