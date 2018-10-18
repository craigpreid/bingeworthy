# import necessary libraries
from flask import Flask, render_template, redirect, url_for, request, session
from flask_pymongo import PyMongo
from .config import MONGO_URI

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = MONGO_URI
mongo = PyMongo(app)
