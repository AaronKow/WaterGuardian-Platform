Meteor.publish('forecastData', function(){
	if(this.userId){
		return Forecast.find({'owner_id': this.userId}, {fields: {'owner_id': false}});
	}
});

Meteor.publish('hourForecastData', function(){
	if(this.userId){
		return HourForecast.find({'owner_id': this.userId}, {fields: {'owner_id': false}});
	}
});

Meteor.publish('temperaturePatternData', function(){
	if(this.userId){
		return TemperaturePattern.find({'owner_id': this.userId}, {fields: {'owner_id': false}});
	}
});

Meteor.publish('fullHourForecastData', function(){
	if(this.userId){
		return FullHourForecast.find({'owner_id': this.userId}, {fields: {'owner_id': false}});
	}
});

Meteor.publish('waterForecastData', function(){
	if(this.userId){
		return ForecastCollection.find({'owner_id': this.userId}, {fields: {'owner_id': false}});
	}
});

Meteor.publish('waterGoal', function(){
	if(this.userId){
		return WaterGoal.find({'owner_id': this.userId}, {fields: {'owner_id': false}});
	}
});

Meteor.publish('sensorData', function(){
	if(this.userId){
		return SensorData.find({'owner_id': this.userId}, {fields: {'owner_id': false}});
	}
});

Meteor.publish('consumptionPattern', function(){
	if(this.userId){
		return ConsumptionPattern.find({'owner_id': this.userId}, {fields: {'owner_id': false}});
	}
});

Meteor.publish('yearTotalConsumption', function(){
	if(this.userId){
		return YearTotal.find({'owner_id': this.userId}, {fields: {'owner_id': false}});
	}
});

Meteor.publish('todayTotalUsage', function(){
	if(this.userId){
		return TodayTotal.find({'owner_id': this.userId}, {fields: {'owner_id': false}});
	}
});

Meteor.publish('avgFlowRate', function(){
	if(this.userId){
		return AvgRate.find({'owner_id': this.userId}, {fields: {'owner_id': false}});
	}
});

Meteor.publish('currentRate', function(){
	if(this.userId){
		return TodayRate.find({'owner_id': this.userId}, {fields: {'owner_id': false}});
	}
});

Meteor.publish('calendarData', function(){
	if(this.userId){
		return Calendar.find({'owner_id': this.userId}, {fields: {'owner_id': false}});
	}
});

Meteor.publish('calendarModal', function(){
	if(this.userId){
		return CalendarModal.find({'owner_id': this.userId}, {fields: {'owner_id': false}});
	}
});

Meteor.publish('emailAccount', function(){
	if(this.userId){
		return EmailCollect.find({'owner_id': this.userId}, {fields: {'owner_id': false}});
	}
});

Meteor.publish('apiCalls', function(){
	if(this.userId){
		return ApiCollection.find({'owner_id': this.userId});
	}
});

Meteor.publish('remoteState', function(){
	if(this.userId){
		return RemoteState.find({'owner_id': this.userId}, {fields: {'owner_id': false, 'owner_token': false}});
	}
});