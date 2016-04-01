Template.realTime.helpers({
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
	}
});

Template.waterClosetRealTime.helpers({
	'waterFlow': function(){
		var state = RemoteState.findOne({});
		if(state.water_closet === 1){
			return '<span style="color: #00cc00;">Running</span>';
		}
		else {
			return '<span style="color: #e60000;">Stopping</span>';
		}
	}
});

Template.waterClosetRealTime.events({
	'click #playRealTime': function(){
		$("#chart_container").remove();
		$("#legend").remove();
		$("#marker").append("<div id='chart_container'><div id='y_axis'></div><div id='realTimeMonitor'></div></div><div id='legend'></div>");

		var e = document.getElementById("realTimeConfigure");
		var timeFrame = e.options[e.selectedIndex].value;

		if(timeFrame === 'all'){
			renderRealTime("water_closet", true, null, 'Water Closet - Water Consumption (Litres)');
		} else {
			renderRealTime("water_closet", false, timeFrame, 'Water Closet - Water Consumption (Litres)');
		}
	},
	'click #startWaterCloset': function(){
		Meteor.call('setRemoteState', Meteor.userId(), 'water_closet', 1);
	},
	'click #stopWaterClose': function(){
		Meteor.call('setRemoteState', Meteor.userId(), 'water_closet', 0);
	}
});

Template.bathRoomRealTime.helpers({
	'waterFlow': function(){
		var state = RemoteState.findOne({});
		if(state.bathroom === 1){
			return '<span style="color: #00cc00;">Running</span>';
		}
		else {
			return '<span style="color: #e60000;">Stopping</span>';
		}
	}
});

Template.bathRoomRealTime.events({
	'click #playRealTime': function(){
		$("#chart_container").remove();
		$("#legend").remove();
		$("#marker").append("<div id='chart_container'><div id='y_axis'></div><div id='realTimeMonitor'></div></div><div id='legend'></div>");

		var e = document.getElementById("realTimeConfigure");
		var timeFrame = e.options[e.selectedIndex].value;

		if(timeFrame === 'all'){
			renderRealTime("bathroom", true, null, 'Bathroom - Water Consumption (Litres)');
		} else {
			renderRealTime("bathroom", false, timeFrame, 'Bathroom - Water Consumption (Litres)');
		}
	},
	'click #startBathroom': function(){
		Meteor.call('setRemoteState', Meteor.userId(), 'bathroom', 1);
	},
	'click #stopBathroom': function(){
		Meteor.call('setRemoteState', Meteor.userId(), 'bathroom', 0);
	}
});

Template.kitchenRealTime.helpers({
	'waterFlow': function(){
		var state = RemoteState.findOne({});
		if(state.kitchen === 1){
			return '<span style="color: #00cc00;">Running</span>';
		}
		else {
			return '<span style="color: #e60000;">Stopping</span>';
		}
	}
});

Template.kitchenRealTime.events({
	'click #playRealTime': function(){
		$("#chart_container").remove();
		$("#legend").remove();
		$("#marker").append("<div id='chart_container'><div id='y_axis'></div><div id='realTimeMonitor'></div></div><div id='legend'></div>");

		var e = document.getElementById("realTimeConfigure");
		var timeFrame = e.options[e.selectedIndex].value;

		if(timeFrame === 'all'){
			renderRealTime("kitchen", true, null, 'Kitchen - Water Consumption (Litres)');
		} else {
			renderRealTime("kitchen", false, timeFrame, 'Kitchen - Water Consumption (Litres)');
		}
	},
	'click #startKitchen': function(){
		Meteor.call('setRemoteState', Meteor.userId(), 'kitchen', 1);
	},
	'click #stopKitchen': function(){
		Meteor.call('setRemoteState', Meteor.userId(), 'kitchen', 0);
	}
});