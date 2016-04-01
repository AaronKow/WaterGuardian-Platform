Template.weather.helpers({
    'reactiveForecast': function(){
        Meteor.call('getCurrentForecast', Geolocation.latLng().lat, Geolocation.latLng().lng, function(err, res){
            if(res){
                renderTemperaturePatten();
                renderHourForecast();
            }
        });
    },
    'forecast': function(){
        return FullHourForecast.findOne({}).forecast_data;
    }
});

Template.forecastStructure1.helpers({
    'forecastData': function(){
        return Forecast.findOne({});
    },
    'weatherIcon': function(){
        var weatherCode =  Forecast.findOne({}).icon;
        if(weatherCode === 'clear-day'){
            return 'wi-day-sunny';
        }
        else if (weatherCode === 'clear-night'){
            return 'wi-night-clear';
        }
        else if (weatherCode === 'rain'){
            return 'wi-rain';
        }
        else if (weatherCode === 'snow'){
            return 'wi-snow';
        }
        else if (weatherCode === 'sleet'){
            return 'wi-sleet';
        }
        else if (weatherCode === 'wind'){
            return 'wi-strong-wind';
        }
        else if (weatherCode === 'fog'){
            return 'wi-fog';
        }
        else if (weatherCode === 'cloudy'){
            return 'wi-cloudy';
        }
        else if (weatherCode === 'partly-cloudy-day'){
            return 'wi-day-cloudy';
        }
        else if (weatherCode === 'partly-cloudy-night'){
            return 'wi-night-alt-cloudy';
        }
        else if (weatherCode === 'hail'){
            return 'wi-hail';
        }
        else if (weatherCode === 'thunderstorm'){
            return 'wi-thunderstorm';
        }
        else if (weatherCode === 'tornado'){
            return 'wi-tornado';
        }
    },
    'cloudDescription': function(){
        var cloudPercent = Forecast.findOne({}).cloudiness;
        if(cloudPercent === 0){
            return 'Clear sky';
        }
        else if(cloudPercent <= 40 && cloudPercent > 0){
            return 'Scattered clouds';
        }
        else if(cloudPercent <= 75 && cloudPercent > 40){
            return 'Broken clouds';
        }
        else if(cloudPercent <= 100 && cloudPercent > 75){
            return 'Overcast skies';
        }
    },
    'weatherstationTime': function(){
        var stationTime = Forecast.findOne({}).fetchTime;
        var d = new Date(stationTime); // parse value to get date
        var result = d.toString();   // convert result to get date in string form
        return result;
    },
    'sunriseTime': function(){
        var sunriseTime = Forecast.findOne({}).sunrise;
        var d = new Date(sunriseTime);
        var result = d.toLocaleTimeString();
        return result;
    },
    'sunsetTime': function(){
        var sunsetTime = Forecast.findOne({}).sunset;
        var d = new Date(sunsetTime);
        var result = d.toLocaleTimeString();
        return result;
    }
});

Template.forecastStructure2.onRendered(function(){
    /* Render flot-line-chart-moving for temperature pattern */
    renderTemperaturePatten();
    renderHourForecast();
});