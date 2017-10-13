// The parent Vue instance
var vm = new Vue({
	el: "#app",
	data: {
		weather: {},
		day: null,
		launched: false,
		zip: null,
		unit: 'F',
		error: null
	},
	methods: {
		// --------- CONTROL METHODS BELOW ---------

		// Launch to view weather data (abstracted here for to allow for future changes)
		launch: function() {
			this.launched = true;
		},
		// Return to main screen
		goBack: function() {
			this.launched = false;
		},
		setUnit: function(unit) {
			this.unit = unit;
		},

		// --------- DATA METHODS BELOW ---------

		// Helper method to get weather - zipcode
		weatherZip: function() {
			Vue.nextTick(function(){
				$('#_launch input[name="zip-code"]').parent().removeClass("error");
			});
			var data = { type: 'zipcode', zip: this.zip };
        	this.weatherAPI(data);
        	// reset zip input
        	this.zip = "";
		},
		// Helper method to get weather - "my location"
		weatherLoc: function() {
			var self = this;
			Vue.nextTick(function(){
				$.ajax({
					type: "GET",
					url: "https://freegeoip.net/json/",
					success: function(returnData) {
						var data = { 
							'lat': returnData.latitude,
							'lon': returnData.longitude
						};
						self.weatherAPI(data);
					},
					error: function(jqXHR, textStatus, errorThrown) {
						self.error = "Cannot find location - server error";
					}
				});
			});
		},
		// Parent method to get weather
		weatherAPI: function(data) {
			var self = this;
        	Vue.nextTick(function(){
				$.ajax({
					type: "GET",
					data: data,
					url: "/weather",
					contentType: "application/json",
					success: function(returnData) {
						if (returnData.error !== undefined) {
							self.error = "Cannot find weather - location is not valid";
						} else {
							self.weather = returnData;
							self.launch();
							self.error = null;
						}
					},
					error: function(jqXHR, textStatus, errorThrown) {
						self.error = "Cannot find weather - server error";
					}
				});
			});
		},

		// --------- VALIDATION METHODS BELOW ---------

		// Validator for US zipcodes
		isValidUSZip: function() {
		   return /^\d{5}(-\d{4})?$/.test(this.zip);
		},

		// --------- CONVERSION METHODS BELOW ---------

		// Convert kelvin to farenheit or celsius
		convertKelvin: function(temp) {
			switch(this.unit) {
				case "F":
					return Math.round( (temp * 9/5) - 459.67) + "\xB0" + "F";
				case "C":
					return Math.round(temp - 273.15) + "\xB0" + "C";
				default: 
					return Math.round(temp) + "\xB0" + "K"
			}
		},
		// Calculate icon gradient based on current temperature
		getTempClass: function(temp) {
			// use fahrenheit to do comparisons
			var cur_temp = Math.round( (temp * 9/5) - 459.67) ;
			switch(true) {
			    case cur_temp >  80:
			        return "hot";
			    case cur_temp >  60:
			        return "warm";
			    case cur_temp >  40:
			        return "cool";
			    // cold
			    default:
			        return "cold";
			}
		},
		// Format the time
		timestamp: function() {
			var date = new Date();
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var ampm = hours >= 12 ? 'PM' : 'AM';
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0'+minutes : minutes;
			var strTime = hours + ':' + minutes + ' ' + ampm;
			return strTime;
		},


		// --------- WEATHER TO TEXT METHODS BELOW ---------

		howCloudy: function(){
			var clouds = this.weather.clouds;
			switch(true) {
			    case clouds >  80:
			        return "It is very cloudy.";
			    case clouds >  50:
			        return "Skies are cloudy.";
			    case clouds >  10:
			        return "There are scattered clouds.";
			    case clouds >  5:
			        return "There are almost clear skies.";
			    default:
			        return "";
			}
		},
		howWindy: function(){
			var wind = this.weather.wind.speed;
			switch(true) {
			    case wind >  20:
			        return "Be cautious of severe wind!";
			    case wind >  11:
			        return "There are strong winds.";
			    case wind >  5:
			        return "There are moderate winds.";
			    case wind >  2:
			        return "There is a light breeze.";
			    default:
			        return "";
			}
		},
	}
});











