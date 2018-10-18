import re
import requests

from .config import omdb_api


def omdb_search(title, show_type, year, specific):
    omdb_url = "http://www.omdbapi.com/?i=tt3896198&apikey=" + omdb_api
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

    array[7]['Writer'] = array[7]['Writer'].split(' ')
    array[8]['Actors'] = array[8]['Actors'].split(' ')

    return array


def insert_or_not(mongo_pointer, title, year, data):
    if not mongo_pointer.db.shows_temp.find_one({title: title, year: year}):
        mongo_pointer.db.shows_temp.insert(data)
