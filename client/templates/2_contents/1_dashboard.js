Template.dashboard.events({
    'click .setupLaunch': function() {
        Meteor.call('initiateAccount');
    },
    'click .testBut': function(evt) {
        // alert('Hello!');
        // Meteor.call('testData');

        Meteor.call('inputData', $('.inputSensor').val(), $('.flowRate1').val(), $('.flowRate2').val());
        // alert($('.inputSensor').val());
    }
});

Template.dashboard.helpers({
    'reactiveData': function() {
        Meteor.call('getCurrentForecast', Geolocation.latLng().lat, Geolocation.latLng().lng);
        renderWaterForecast();
        // Meteor.call('getCurrentForecast', Geolocation.latLng().lat, Geolocation.latLng().lng, function(err, res) {
        //     if (res) {
        //         renderConsumptionPatten();
        //         renderWaterForecast();
        //     }
        // });
    },
    'waterGoalChecker': function(){
        var goal = WaterGoal.findOne({});
        var val1 = (parseFloat(goal.daily_data.data_goal) - parseFloat(goal.daily_data.usage)).toFixed(2);
        var val2 = (parseFloat(goal.water_closet_data.day_goal) - parseFloat(goal.water_closet_data.day_usage)).toFixed(2);
        var val3 = (parseFloat(goal.bathroom_data.day_goal) - parseFloat(goal.bathroom_data.day_usage)).toFixed(2);
        var val4 = (parseFloat(goal.kitchen_data.day_goal) - parseFloat(goal.kitchen_data.day_usage)).toFixed(2);

        if(val1 < 0){
            Meteor.call("sendWarningNotify", "daily");
            sAlert.error("Your daily usage have exceed today water goal.");
        }
        if(val2 < 0){
            Meteor.call("sendWarningNotify", "water_closet");
            sAlert.error("Your water closet daily usage have exceed today water goal.");
        }
        if(val3 < 0){
            Meteor.call("sendWarningNotify", "bathroom");
            sAlert.error("Your bathroom daily usage have exceed today water goal.");
        }
        if(val4 < 0){
            Meteor.call("sendWarningNotify", "kitchen");
            sAlert.error("Your kitchen daily usage have exceed today water goal.");
        }
    },
    'totalYear': function() {
        return YearTotal.findOne({}).water_data;
    },
    'todayUsage': function() {
        return TodayTotal.findOne({}).water_data;
    },
    'totalAvgRate': function() {
        return AvgRate.findOne({}).water_data;
    },
    'currentRate': function() {
        return TodayRate.findOne({}).water_data;
    }
});

Template.waterGoal.helpers({
    'annualGoal': function() {
        // console.log()
        return WaterGoal.findOne({}).annual_data.data_goal;
    },
    'monthlyGoal': function() {
        return WaterGoal.findOne({}).monthly_data.data_goal;
    },
    'dailyGoal': function() {
        return WaterGoal.findOne({}).daily_data.data_goal;
    },
    'date': function() {
        return moment(new Date(WaterGoal.findOne({}).created_date)).format('MMMM Do YYYY');
    }
});

Template.cityForecast.helpers({
    'forecastData': function() {
        return Forecast.findOne({});
    },
    'weatherIcon': function() {
        var weatherCode = Forecast.findOne({}).icon;
        if (weatherCode === 'clear-day') {
            return 'wi-day-sunny';
        } else if (weatherCode === 'clear-night') {
            return 'wi-night-clear';
        } else if (weatherCode === 'rain') {
            return 'wi-rain';
        } else if (weatherCode === 'snow') {
            return 'wi-snow';
        } else if (weatherCode === 'sleet') {
            return 'wi-sleet';
        } else if (weatherCode === 'wind') {
            return 'wi-strong-wind';
        } else if (weatherCode === 'fog') {
            return 'wi-fog';
        } else if (weatherCode === 'cloudy') {
            return 'wi-cloudy';
        } else if (weatherCode === 'partly-cloudy-day') {
            return 'wi-day-cloudy';
        } else if (weatherCode === 'partly-cloudy-night') {
            return 'wi-night-alt-cloudy';
        } else if (weatherCode === 'hail') {
            return 'wi-hail';
        } else if (weatherCode === 'thunderstorm') {
            return 'wi-thunderstorm';
        } else if (weatherCode === 'tornado') {
            return 'wi-tornado';
        }
    },
    'weatherstationTime': function() {
        var stationTime = Forecast.findOne({}).fetchTime;
        var d = new Date(stationTime); // parse value to get date
        var result = d.toString(); // convert result to get date in string form
        return result;
    }
});

Template.dashboard.onRendered(function() {
    Meteor.call('initiateAccount');
    Meteor.call('refreshSensorData');
});

Template.waterConsumption.onRendered(function() {
    /* Render flot-line-chart-moving for temperature pattern */
    renderConsumptionPatten();
});

Template.waterForecast.events({
    'click .refreshForecast': function() {
        $(".refreshForecast").html('Loading ...');
        Meteor.call('getWaterForecast');
    }
});

Template.waterForecast.onRendered(function() {
    renderWaterForecast();
});

Template.waterGoal.onRendered(function() {
    renderDashBoardGoal();
});