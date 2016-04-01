if(Meteor.isServer){
	Meteor.methods({
		'getCurrentForecast': function(lat, lng){
			check(lat, Number);
			check(lng, Number);

			var lastDatabase = Forecast.find({'owner_id': Meteor.userId()}).fetch();
			var timeChecker;
			if(lastDatabase[0]){
				timeChecker = (moment().valueOf() - moment(lastDatabase[0].fetchTime).valueOf());
			}
			/* initiate database for the first time or update forecast data every 5 minutes = 300000ms */
			if(!lastDatabase[0] || timeChecker >= 300000){

				/* Fetch data from openweathermap.org */
				var openWeatherMapData = Meteor.http.call('GET', 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lng + '&units=metric' + '&APPID=' + Meteor.settings.services.forecastIO.APIkey);
				var procOpenWeatherMapData = JSON.parse(openWeatherMapData.content);


				/* Fetch data from forecast.io */
				var forecastIOData = Meteor.http.call('GET', 'https://api.forecast.io/forecast/165f7ee8c5c8b04a912fc3b04bc32955/' + lat + ',' + lng + '/?units=si');


				/* Initiate the graph data for the first time */
				var graphInit;
				var graphData = HourForecast.find({'owner_id': Meteor.userId()}).fetch();
				if(!graphData[0]){
					var date = new Date();
					graphInit = true;
					// Meteor.call('updateLogs', 'Account Creation', 'This ePersonal account has just been created.', date.toISOString()) // save logs for first account creation.
					console.log('Forecast database created for ' + Meteor.userId() + ' at date: ' + date + '.');
				} else {
					graphInit = false;
				}


				/* Get fetch time in ISO time format */
				var fetchTime = new Date(forecastIOData.data.currently.time * 1000);
				var fetchTimeISO = fetchTime.toISOString();
				console.log('Data now update at time: ' + fetchTime);
				var sunriseTime = new Date(forecastIOData.data.daily.data[0].sunriseTime * 1000);
				var sunriseTimeISO = sunriseTime.toISOString();
				var sunsetTime = new Date(forecastIOData.data.daily.data[0].sunsetTime * 1000);
				var sunsetTimeISO = sunsetTime.toISOString();

				/* Get cloudiness percentage */
				var cloudPercentage = (forecastIOData.data.currently.cloudCover * 100);

				/* Get humidity percentage */
				var humidityPercent = (forecastIOData.data.currently.humidity * 100);

				/* Get precipitation percentage */
				var precipitationPercent = (forecastIOData.data.currently.precipProbability * 100);

				Forecast.remove({'owner_id': Meteor.userId()});
				Forecast.insert({
					'owner_id': Meteor.userId(), // Meteor.user().username
					'created_at': new Date(),
					'city': procOpenWeatherMapData.name,
					'country': procOpenWeatherMapData.sys.country,
					'icon': forecastIOData.data.currently.icon,
					'temperature': (forecastIOData.data.currently.temperature).toFixed(2),
					'forecast_statement': forecastIOData.data.hourly.summary,
					'weather': forecastIOData.data.currently.summary,
					'fetchTime': fetchTimeISO,
					'windSpeed': (forecastIOData.data.currently.windSpeed).toFixed(2),
					'windDegree': forecastIOData.data.currently.windBearing,
					'cloudiness': cloudPercentage.toFixed(2),
					'precipProbability': precipitationPercent.toFixed(2),
					'precipType': forecastIOData.data.currently.precipType,
					'pressure': (forecastIOData.data.currently.pressure).toFixed(2),
					'humidity': humidityPercent.toFixed(2),
					'sunrise': sunriseTimeISO,
					'sunset': sunsetTimeISO,
					'latitude': lat.toFixed(2),
					'longitude': lng.toFixed(2)
				});


				/* HourForecast & TemperaturePattern & FullHourForecast Datasets Configurations */
				var forecast_data = [], precipitation_value, arrayTemperature = [], fullForecast_data = [];
				for (var i=0; i<forecastIOData.data.hourly.data.length; i++){ // total 49 points for 2 days

					/* Get fetch time in ISO time format */
					var fetchTime = new Date(forecastIOData.data.hourly.data[i].time * 1000);
					var fetchTimeISO = fetchTime.toISOString();

					/* Wind Speed */
					var windSpeed_value = forecastIOData.data.hourly.data[i].windSpeed * 10;

					/* Precipitation */
					var precipitation_value = forecastIOData.data.hourly.data[i].precipIntensity * 100;


					/* Initiate the forecast_data for the first time */
					if(!forecast_data[0]){
						/* Push all data into forecast_data in array form */
						forecast_data.push({
							'forecastTime': fetchTimeISO,
							'time_checker': forecastIOData.data.hourly.data[i].time,
							'precipitation': precipitation_value.toFixed(1), // divide 100 for actual value
							'temperature': forecastIOData.data.hourly.data[i].temperature,
							'weather': forecastIOData.data.hourly.data[i].summary,
							'windSpeed': windSpeed_value.toFixed(1),	// divide 10 for actual value
							'windDegree': forecastIOData.data.hourly.data[i].windBearing,
							'cloudiness': forecastIOData.data.hourly.data[i].cloudCover,
							'pressure': forecastIOData.data.hourly.data[i].pressure,
							'humidity': forecastIOData.data.hourly.data[i].humidity
						});
					}
					else if (forecast_data[0] && forecast_data.length < 9){
						var arrayValue = (forecast_data.length - 1);

						/* Update the data every 3 hour interval, for 24 hours data = 9 values */
						if((forecastIOData.data.hourly.data[i].time - forecast_data[arrayValue].time_checker) === 10800){

							/* Push all data into forecast_data in array form */
							forecast_data.push({
								'forecastTime': fetchTimeISO,
								'time_checker': forecastIOData.data.hourly.data[i].time,
								'precipitation': precipitation_value.toFixed(1), // divide 100 for actual value
								'temperature': forecastIOData.data.hourly.data[i].temperature,
								'weather': forecastIOData.data.hourly.data[i].summary,
								'windSpeed': windSpeed_value.toFixed(1),	// divide 10 for actual value
								'windDegree': forecastIOData.data.hourly.data[i].windBearing,
								'cloudiness': forecastIOData.data.hourly.data[i].cloudCover,
								'pressure': forecastIOData.data.hourly.data[i].pressure,
								'humidity': forecastIOData.data.hourly.data[i].humidity
							});
						}
					}

					/* TemperaturePattern Datasets Configurations */
					arrayTemperature.push({
						'forecastTime': fetchTimeISO,
						'temperature': forecastIOData.data.hourly.data[i].temperature
					});

					/* FullHourForecast Datasets Configurations */
					fullForecast_data.push({
						'forecastTime': fetchTimeISO,
						'summary': forecastIOData.data.hourly.data[i].summary,
						'precipType': forecastIOData.data.hourly.data[i].precipType,
						'precipitation': (forecastIOData.data.hourly.data[i].precipIntensity).toFixed(1),
						'windSpeed': (forecastIOData.data.hourly.data[i].windSpeed).toFixed(1),
						'windDegree': (forecastIOData.data.hourly.data[i].windBearing).toFixed(1),
						'pressure': (forecastIOData.data.hourly.data[i].pressure).toFixed(1),
						'humidity': (forecastIOData.data.hourly.data[i].humidity * 100).toFixed(1), // divide 100 for actual value
						'ozone': (forecastIOData.data.hourly.data[i].ozone).toFixed(1),
						'temperature': (forecastIOData.data.hourly.data[i].temperature).toFixed(1), // use in graph
						'cloudCover': (forecastIOData.data.hourly.data[i].cloudCover * 100).toFixed(1), // use in graph, divide 100 for actual value
						'dewPoint': (forecastIOData.data.hourly.data[i].dewPoint).toFixed(1), // use in graph
						'precipProbability': (forecastIOData.data.hourly.data[i].precipProbability * 100).toFixed(1), // use in graph, divide 100 for actual value
						'precipitation_graph': precipitation_value.toFixed(1), // use in graph, divide 100 for actual value
						'windSpeed_graph': windSpeed_value.toFixed(1),	// use in graph, divide 10 for actual value
						'pressure_graph': (forecastIOData.data.hourly.data[i].pressure/100).toFixed(1), // use in graph, times 100 for actual value
						'ozone_graph': (forecastIOData.data.hourly.data[i].ozone/10).toFixed(1) // use in graph, times 10 for actual value
					});
				}


				/* Update the HourForecast in database */
				HourForecast.remove({'owner_id': Meteor.userId()});
				HourForecast.insert({
					'owner_id': Meteor.userId(),
					'created_at': new Date(),
					'city': procOpenWeatherMapData.name,
					'country': procOpenWeatherMapData.sys.country,
					'forecast_data': forecast_data,
					'latitude': lat.toFixed(2),
					'longitude': lng.toFixed(2)
				});

				/* Update the TemperaturePattern in database */
				TemperaturePattern.remove({'owner_id': Meteor.userId()});
				TemperaturePattern.insert({
					'owner_id': Meteor.userId(),
					'created_at': new Date(),
					'temperature_pattern': arrayTemperature
				});

				/* Update the FullHourForecast in database */
				FullHourForecast.remove({'owner_id': Meteor.userId()});
				FullHourForecast.insert({
					'owner_id': Meteor.userId(),
					'created_at': new Date(),
					'forecast_data': fullForecast_data
				});


				/* Tell the client if this is the first time render graph */
				return graphInit;
			}
		}
	});
}