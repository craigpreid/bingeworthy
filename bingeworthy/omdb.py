import re
import requests
import json
from bson import ObjectId

from .config import omdb_api


def omdb_search(title, show_type, year, specific):
    omdb_url = "http://www.omdbapi.com/?apikey=" + omdb_api
    title = title.replace(' ', '+')

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
    # omdb_url = omdb_data.url
    omdb_data = omdb_data.json()
    return (omdb_data)


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

    array[7]['Writer'] = array[7]['Writer'].split(',')
    array[8]['Actors'] = array[8]['Actors'].split(',')

    return array


def insert_or_not(mongo_pointer, data):
    obj = mongo_pointer.db.shows_omdb.find_one({'imdb_id': data['imdb_id']})
    if not obj:
        obj = mongo_pointer.db.shows_omdb.insert(data)
    else:
        obj = obj['_id']

    return obj


def insert_or_update_movie_user(mongo_pointer, data):
    obj = mongo_pointer.db.shows_user.find_one({'movie': data['movie'], 'user': data['user']})
    if not obj:
        obj = mongo_pointer.db.shows_user.insert(data)
    else:
        obj.update(data)
        obj = obj['_id']

    return obj


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)


def get_by_imdb_id(imdb_id):
    omdb_url = "http://www.omdbapi.com/?apikey=" + omdb_api
    omdb_url += '&i=' + imdb_id
    omdb_data = requests.get(omdb_url)
    omdb_data = omdb_data.json()

    data = {}
    for key, item in iter(omdb_data.items()):
        data[to_snake_case(key)] = item

    return data
