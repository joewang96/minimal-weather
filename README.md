# minimal-weather
Weather app built using Python and Vue.js to display weather information in a simple and concise manner.

Heroku deployed app can be found [here](https://py-vue-weather.herokuapp.com/)

## Getting Started

These steps will explain how to setup your own version of this weather web app. Below I will go into details regarding how to setup the project using virtualenv to manage the dependencies and provide a clean workspace for the enviornment. 

### Prerequisites

First, install virtualenv if you haven't done so already, and create an enviornement inside of a directory which you will use to hold both the enviornment and the source folder of the repo.

### Installing

To create a virtual-enviornment in the directory you are in, use the following code:
```
virtualenv .
```

To activate the virtual-enviornment, run the following command from the directory you created the virtual enviornment in
```
source bin/activate
```

Next, using the requirements.txt file included, install the dependancies using the following command again from the same directory:
```
pip install -r requirements.txt
```

### Running Locally

Once the dependencies are set up, you should be good to run the app using Flask on your local machine. I recommend running the debug option to make sure everything is set up correctly. If you don't want this function, change the 1 to 0 in the following command:

```
FLASK_APP=main.py FLASK_DEBUG=1 python -m flask run
```
The app should be running on localhost:5000 by default, so open that up in your browser to launch the weather app


### Example Screenshots

![Initial Landing Page for the app](readme_assets/landing.png?raw=true "Landing Page")

![Example Data Page for Location](readme_assets/data.png?raw=true "Example Data Page for Location")


