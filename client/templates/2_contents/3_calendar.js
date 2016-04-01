Template.scheduleModal.helpers({
	'title': function(){
		return CalendarModal.findOne({}).sensor_locate;
	},
	'description': function(){
		return CalendarModal.findOne({}).description;
	},
	'usage': function(){
		return CalendarModal.findOne({}).water_data;
	},
	'avgFlowRate': function(){
		return CalendarModal.findOne({}).avg_flow_rate;
	},
	'startTime': function(){
		return CalendarModal.findOne({}).start;
	},
	'endTime': function(){
		return CalendarModal.findOne({}).end;
	},
	'duration': function(){
		var date1 = new Date(CalendarModal.findOne({}).start);
		var date2 = new Date(CalendarModal.findOne({}).end);
		
		// make sure end time is available
		if(date2){
			var date3 = ((date2.getTime() - date1.getTime())/1000)/60; // get difference in minutes
			return date3.toFixed(2);

		} else {
			return 0;
		}
	}
});

Template.calendar.onRendered(function(){
    renderCalendar(Calendar.findOne({}).water_schedule);
});