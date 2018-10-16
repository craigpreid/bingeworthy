# import necessary libraries
from flask import Flask, render_template, redirect, url_for, request, session
from flask_pymongo import PyMongo

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/binge_app"
mongo = PyMongo(app)