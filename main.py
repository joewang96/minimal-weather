from flask import Flask, render_template, request, redirect, jsonify
import requests
import json
import os

# Start the main app
app = Flask(__name__)
# Set the directory to retrieve static files from
app.static_folder = 'static'

# Variables to use for app
location = None
weather_api_key = "79b57a44308eea0e1f732061cf675137"

# Methods
'''
-- Can use for local enviornment, but not for heroku --
def getLocationIP():
	url = 'http://freegeoip.net/json'
	req = requests.get(url)
	res = req.json()
	return res
'''

def cleanAPI(_json):
    # if exception is thrown here, then return error message
    try:
        cleaned = {}
        cleaned['name'] = _json['name']
        cleaned['temp'] = {
            'current': int(_json['main']['temp']),
            'min':  int(_json['main']['temp_min']),
            'max':  int(_json['main']['temp_max'])
        }
        cleaned['features'] = _json['weather']
        cleaned['humidity'] = _json['main']['humidity']
    except:
        return {"error": "bad location"}
    # wind speed (meter/sec) and direction
    try:
        cleaned['wind'] = _json['wind']
    except:
        cleaned['wind'] = 0
    # last 3hr rain volume
    try:
        cleaned['rain'] = _json['rain']
    except:
        cleaned['rain'] = 0
    # last 3hr rain volume
    try:
        cleaned['snow'] = _json['snow']
    except:
        cleaned['snow'] = 0
    # cloud coverage (%)
    try:
        cleaned['clouds'] = _json['clouds']['all']
    except:
        cleaned['clouds'] = "none"
    return cleaned

def requestWeather(_data):
    url = 'https://api.openweathermap.org/data/2.5/weather'
    payload = _data
    payload['APPID'] = weather_api_key
    req = requests.get(url, params=payload)
    res = cleanAPI(req.json())
    return res

# Routes
@app.route('/')
def landing():
    location = getLocationIP()
    # render the landing page template here
    return render_template('landing.html', location=location)

@app.route('/weather', methods=['GET'])
def weatherAPI():
    _type = request.args.get('type')
    if _type == 'zipcode':
        _data = { 'zip': request.args.get('zip') }
        _result = requestWeather(_data)
    else:
        '''
        _geo = getLocationIP()
        _data = { 
            'lat': _geo['latitude'],
            'lon': _geo['longitude'] 
        }
        '''
        _result = requestWeather(_data)
    return jsonify(_result)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run()