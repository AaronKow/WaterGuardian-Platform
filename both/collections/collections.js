/* Forecast Collections */
Forecast = new Meteor.Collection('forecast');
HourForecast = new Meteor.Collection('hourForecast');
DailyForecast = new Meteor.Collection('dailyForecast');
FullHourForecast = new Meteor.Collection('fullHourForecast');

/* Water Consumption Forecast Collection */
WaterForecast = new Meteor.Collection('waterForecast');
ForecastCollection = new Meteor.Collection('forecastCollection');

/* Temperature Pattern Collection */
TemperaturePattern = new Meteor.Collection('temperaturePattern');

/* Database for Sensor Data */
SensorData = new Meteor.Collection('sensorData');					// raw sensors data
SensorRecords = new Meteor.Collection('sensorRecords');				// proper arrangement of sensors in sorting with year, month and day
ConsumptionPattern = new Meteor.Collection('consumptionPattern');

/* Yearly Data */
YearTotal = new Meteor.Collection('yearTotal');		// Year Total Usage

/* Monthly Data*/
MonthTotal = new Meteor.Collection('monthTotal');

/* Today Data */
TodayTotal = new Meteor.Collection('todayTotal');	// Today Total Usage
TodayRate = new Meteor.Collection('todayRate');		// Today Average Rate
AvgRate = new Meteor.Collection('avgRate');			// Average Flow Rate

/* Water Goal */
WaterGoal = new Meteor.Collection('waterGoal');

/* Calendar */
Calendar = new Meteor.Collection('calendar');
CalendarModal = new Meteor.Collection('calendarModal');

/* Email Collection */
EmailCollect = new Meteor.Collection('emailCollect');

/* API Token */
ApiCollection = new Meteor.Collection('apiCollection');

/* Remote Status for valve */
RemoteState = new Meteor.Collection('remoteState');