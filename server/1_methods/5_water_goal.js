if (Meteor.isServer) {
	Meteor.methods({
		'setWaterGoal': function(annualData, monthlyData, dailyData, waterClosetData, bathroomData, kitchenData) {
			WaterGoal.remove({
				'owner_id': Meteor.userId()
			}); // reset data to fetch latest data

			/* Make sure user input data are numbers */
			annualData = parseFloat(annualData);
			monthlyData = parseFloat(monthlyData);
			dailyData = parseFloat(dailyData);
			waterClosetData = parseFloat(waterClosetData);
			bathroomData = parseFloat(bathroomData);
			kitchenData = parseFloat(kitchenData);

			if (isNaN(annualData)) {
				annualData = 0;
			}
			if (isNaN(monthlyData)) {
				monthlyData = 0;
			}
			if (isNaN(dailyData)) {
				dailyData = 0;
			}
			if (isNaN(waterClosetData)) {
				waterClosetData = 0;
			}
			if (isNaN(bathroomData)) {
				bathroomData = 0;
			}
			if (isNaN(kitchenData)) {
				kitchenData = 0;
			}

			/* Fetch latest data from database */
			var yearTotal = YearTotal.findOne({
				'owner_id': Meteor.userId()
			});
			var todayTotal = TodayTotal.findOne({
				'owner_id': Meteor.userId()
			});
			var monthTotal = MonthTotal.findOne({
				'owner_id': Meteor.userId()
			});
			var sensorRecords = SensorRecords.findOne({
				'owner_id': Meteor.userId()
			});


			WaterGoal.insert({
				'created_date': (new Date()).toISOString(),
				'owner_id': Meteor.userId(),
				'annual_data': {
					'data_goal': (annualData).toFixed(2),
					'usage': yearTotal.water_data
				},
				'monthly_data': {
					'data_type': 'monthly_data',
					'data_goal': (monthlyData).toFixed(2),
					'usage': monthTotal.water_data,

				},
				'daily_data': {
					'data_type': 'daily_data',
					'data_goal': (dailyData).toFixed(2),
					'usage': todayTotal.water_data
				},
				'water_closet_data': {
					'data_type': 'sensor_data',
					'year_goal': (waterClosetData*365).toFixed(2),
					'month_goal': (waterClosetData*30.4167).toFixed(2),
					'day_goal': (waterClosetData).toFixed(2),
					'year_usage': sensorRecords['water_closet'].year,
					'month_usage': sensorRecords['water_closet'].month,
					'day_usage': sensorRecords['water_closet'].day
				},
				'bathroom_data': {
					'data_type': 'sensor_data',
					'year_goal': (bathroomData*365).toFixed(2),
					'month_goal': (bathroomData*30.4167).toFixed(2),
					'day_goal': (bathroomData).toFixed(2),
					'year_usage': sensorRecords['bathroom'].year,
					'month_usage': sensorRecords['bathroom'].month,
					'day_usage': sensorRecords['bathroom'].day
				},
				'kitchen_data': {
					'data_type': 'sensor_data',
					'year_goal': (kitchenData*365).toFixed(2),
					'month_goal': (kitchenData*30.4167).toFixed(2),
					'day_goal': (kitchenData).toFixed(2),
					'year_usage': sensorRecords['kitchen'].year,
					'month_usage': sensorRecords['kitchen'].month,
					'day_usage': sensorRecords['kitchen'].day
				}
			});
		},
		'updateWaterGoal': function(owner_id){
			var waterGoal = WaterGoal.findOne({'owner_id': owner_id});
			var sensorRecords = SensorRecords.findOne({'owner_id': owner_id});

			/* Fetch latest data from database */
			var yearTotal = YearTotal.findOne({'owner_id': owner_id});
			var monthTotal = MonthTotal.findOne({'owner_id': owner_id});
			var todayTotal = TodayTotal.findOne({'owner_id': owner_id});

			waterGoal.annual_data.usage = yearTotal.water_data;
			waterGoal.monthly_data.usage = monthTotal.water_data;
			waterGoal.daily_data.usage = todayTotal.water_data;

			waterGoal.water_closet_data.year_usage = sensorRecords.water_closet.year;
			waterGoal.water_closet_data.month_usage = sensorRecords.water_closet.month;
			waterGoal.water_closet_data.day_usage = sensorRecords.water_closet.day;

			waterGoal.bathroom_data.year_usage = sensorRecords.bathroom.year;
			waterGoal.bathroom_data.month_usage = sensorRecords.bathroom.month;
			waterGoal.bathroom_data.day_usage = sensorRecords.bathroom.day;

			waterGoal.kitchen_data.year_usage = sensorRecords.kitchen.year;
			waterGoal.kitchen_data.month_usage = sensorRecords.kitchen.month;
			waterGoal.kitchen_data.day_usage = sensorRecords.kitchen.day;

			/* Update Datebase */
			WaterGoal.update({'owner_id': owner_id}, waterGoal);
			console.log("Updated water goal for user: " + owner_id);
		},
		'checkWaterGoal': function(owner_id){
			var waterGoal = WaterGoal.findOne({'owner_id': owner_id});
			var sensorRecords = SensorRecords.findOne({'owner_id': owner_id});

			/* Fetch latest data from database */
			var yearTotal = YearTotal.findOne({'owner_id': owner_id});
			var monthTotal = MonthTotal.findOne({'owner_id': owner_id});
			var todayTotal = TodayTotal.findOne({'owner_id': owner_id});
			
			/* Stop all water flow if goal is reached */
			if((parseFloat(yearTotal.water_data) > parseFloat(waterGoal.annual_data.data_goal)) || (parseFloat(monthTotal.water_data) > parseFloat(waterGoal.monthly_data.data_goal)) || (parseFloat(todayTotal.water_data) > parseFloat(waterGoal.daily_data.data_goal))){
				Meteor.call('setRemoteState', owner_id, "water_closet", 0);
				Meteor.call('setRemoteState', owner_id, "bathroom", 0);
				Meteor.call('setRemoteState', owner_id, "kitchen", 0);
			}

			/* Stop Water Flow at Water Closet if goal is reached */
			if((parseFloat(sensorRecords.water_closet.year) > parseFloat(waterGoal.water_closet_data.year_goal)) || (parseFloat(sensorRecords.water_closet.month) > parseFloat(waterGoal.water_closet_data.month_goal)) || (parseFloat(sensorRecords.water_closet.day) > parseFloat(waterGoal.water_closet_data.day_goal))){
				Meteor.call('setRemoteState', owner_id, "water_closet", 0);
			}

			/* Stop Water Flow at Bathroom if goal is reached */
			if((parseFloat(sensorRecords.bathroom.year) > parseFloat(waterGoal.bathroom_data.year_goal)) || (parseFloat(sensorRecords.bathroom.month) > parseFloat(waterGoal.bathroom_data.month_goal)) || (parseFloat(sensorRecords.bathroom.day) > parseFloat(waterGoal.bathroom_data.day_goal))){
				Meteor.call('setRemoteState', owner_id, "bathroom", 0);
			}

			/* Stop Water Flow at Kitchen if goal is reached */
			if((parseFloat(sensorRecords.kitchen.year) > parseFloat(waterGoal.kitchen_data.year_goal)) || (parseFloat(sensorRecords.kitchen.month) > parseFloat(waterGoal.kitchen_data.month_goal)) || (parseFloat(sensorRecords.kitchen.day) > parseFloat(waterGoal.kitchen_data.day_goal))){
				Meteor.call('setRemoteState', owner_id, "kitchen", 0);
			}
		}
	});
}