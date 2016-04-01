Template.waterGoalOverview.onRendered(function(){
	// Meteor.call('refreshSensorData');
	Meteor.call('updateWaterGoal', Meteor.userId());
	setTimeout(function() {renderWaterGoalOverview();}, 10);
});

Template.waterGoalOverview.helpers({
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

Template.currentGoal.helpers({
	'annualGoal': function(){
		// console.log()
		return WaterGoal.findOne({}).annual_data.data_goal;
	},
	'monthlyGoal': function(){
		return WaterGoal.findOne({}).monthly_data.data_goal;
	},
	'dailyGoal': function(){
		return WaterGoal.findOne({}).daily_data.data_goal;
	}
});

Template.waterClosetGoal.helpers({
	'annualGoal': function(){
		// console.log()
		return WaterGoal.findOne({}).water_closet_data.year_goal;
	},
	'monthlyGoal': function(){
		return WaterGoal.findOne({}).water_closet_data.month_goal;
	},
	'dailyGoal': function(){
		return WaterGoal.findOne({}).water_closet_data.day_goal;
	}
});

Template.bathroomGoal.helpers({
	'annualGoal': function(){
		// console.log()
		return WaterGoal.findOne({}).bathroom_data.year_goal;
	},
	'monthlyGoal': function(){
		return WaterGoal.findOne({}).bathroom_data.month_goal;
	},
	'dailyGoal': function(){
		return WaterGoal.findOne({}).bathroom_data.day_goal;
	}
});

Template.kitchenGoal.helpers({
	'annualGoal': function(){
		// console.log()
		return WaterGoal.findOne({}).kitchen_data.year_goal;
	},
	'monthlyGoal': function(){
		return WaterGoal.findOne({}).kitchen_data.month_goal;
	},
	'dailyGoal': function(){
		return WaterGoal.findOne({}).kitchen_data.day_goal;
	}
});

Template.currentGoalYear.helpers({
	'Year': function(){
		return moment(new Date(WaterGoal.findOne({}).created_date)).format('YYYY');
	}
});

Template.waterClosetGoalYear.helpers({
	'Year': function(){
		return moment(new Date(WaterGoal.findOne({}).created_date)).format('YYYY');
	}
});

Template.bathroomGoalYear.helpers({
	'Year': function(){
		return moment(new Date(WaterGoal.findOne({}).created_date)).format('YYYY');
	}
});

Template.kitchenGoalYear.helpers({
	'Year': function(){
		return moment(new Date(WaterGoal.findOne({}).created_date)).format('YYYY');
	}
});

Template.currentGoalMonth.helpers({
	'Month': function(){
		return moment(new Date(WaterGoal.findOne({}).created_date)).format('MMMM');
	}
});

Template.waterClosetGoalMonth.helpers({
	'Month': function(){
		return moment(new Date(WaterGoal.findOne({}).created_date)).format('MMMM');
	}
});

Template.bathroomGoalMonth.helpers({
	'Month': function(){
		return moment(new Date(WaterGoal.findOne({}).created_date)).format('MMMM');
	}
});

Template.kitchenGoalMonth.helpers({
	'Month': function(){
		return moment(new Date(WaterGoal.findOne({}).created_date)).format('MMMM');
	}
});

Template.currentGoalDay.helpers({
	'FullDate': function(){
		return moment(new Date(WaterGoal.findOne({}).created_date)).format('Do MMM YYYY');
	}
});

Template.waterClosetGoalDay.helpers({
	'FullDate': function(){
		return moment(new Date(WaterGoal.findOne({}).created_date)).format('Do MMM YYYY');
	}
});

Template.bathroomGoalDay.helpers({
	'FullDate': function(){
		return moment(new Date(WaterGoal.findOne({}).created_date)).format('Do MMM YYYY');
	}
});

Template.kitchenGoalDay.helpers({
	'FullDate': function(){
		return moment(new Date(WaterGoal.findOne({}).created_date)).format('Do MMM YYYY');
	}
});

Template.waterGoalOverview.events({
	'click .goalModal': function(){
		/* Set value to input beforehand */
		var waterData = WaterGoal.findOne({});
		$('#yearGoalInput').val(waterData.annual_data.data_goal);
		$('#monthGoalInput').val(waterData.monthly_data.data_goal);
		$('#dayGoalInput').val(waterData.daily_data.data_goal);
		$('#WaterClosetGoalInput').val(waterData.water_closet_data.day_goal);
		$('#BathroomGoalInput').val(waterData.bathroom_data.day_goal);
		$('#KitchenGoalInput').val(waterData.kitchen_data.day_goal);

		/* Show Pop Up Form */
		$('.waterGoalModal').modal('show');
		$('.waterGoalModal').on('shown.bs.modal', function () {
			$('.waterGoalModal').focus();
		});
		// window.location.replace("http://localhost:3000/water-goal");
	}
});

Template.goalModal.events({
	'input #yearGoalInput': function(evt, template){
		setWaterGoals1();
	},
	'input #monthGoalInput': function(evt, template){
		setWaterGoals2();
	},
	'input #dayGoalInput': function(evt, template){
		setWaterGoals3();
	},
	'input #WaterClosetGoalInput': function(evt, template){
		setAllWaterGoals();
	},
	'input #BathroomGoalInput': function(evt, template){
		setAllWaterGoals();
	},
	'input #KitchenGoalInput': function(evt, template){
		setAllWaterGoals();
	},
	'click .editEventButton': function(){
		var value1 = $('#yearGoalInput').val();
		var value2 = $('#monthGoalInput').val();
		var value3 = $('#dayGoalInput').val();
		var value4 = $('#WaterClosetGoalInput').val();
		var value5 = $('#BathroomGoalInput').val();
		var value6 = $('#KitchenGoalInput').val();

		Meteor.call('setWaterGoal', value1, value2, value3, value4, value5, value6);
		window.location.replace("/water-goal");
	}
});