Template.dataLoggingGraph.onRendered(function(){
	var fetchData = SensorData.find({}).fetch();
	plotLineChart(fetchData);
});


Template.dataLoggingDetails.helpers({
	'sensorData': function(){
		return SensorData.find({}, {sort: {'created_date': -1}}).fetch();
	}
});