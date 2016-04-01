if (Meteor.isServer) {
	Meteor.methods({
		'initiateAccount': function() {
			/* Checker to check whether this is a new account */
			var checker = YearTotal.findOne({
				'owner_id': Meteor.userId()
			});

			if (!checker && Meteor.userId()) {
				var arrayData = {
					'created_date': (new Date()).toISOString(),
					'owner_id': Meteor.userId(),
					'water_data': 0
				};

				/* Year Total Usage */
				YearTotal.insert(arrayData);

				/* Month Total Usage */
				MonthTotal.insert(arrayData);

				/* Today Total Usage */
				TodayTotal.insert(arrayData);

				/* Year Average Usage */
				AvgRate.insert(arrayData);

				/* Today Average Usage */
				TodayRate.insert(arrayData);

				SensorRecords.insert({
					'created_date': (new Date()).toISOString(),
					'owner_id': Meteor.userId(),
					'water_closet': {
						'year': 0,
						'month': 0,
						'day': 0
					},
					'bathroom': {
						'year': 0,
						'month': 0,
						'day': 0
					},
					'kitchen': {
						'year': 0,
						'month': 0,
						'day': 0
					}
				});

				/* Initiate Water Goal */
				Meteor.call('setWaterGoal', 0, 0, 0, 0, 0, 0);

				/* Initiate for Water Usage Calendar */
				Meteor.call('calendarInit');

				console.log('Complete Creating an Account for: ' + Meteor.userId());
			}
		},
		'inputData': function(device_id, device_token, sensor_locate, water_data, l_min_data, l_hour_data) {
			/* Verification for Device ID and Token */
			var ID = ApiCollection.findOne({
				'owner_id': device_id
			});
			if (ID) {
				if (ID.owner_token !== device_token) {
					console.log('Unauthorized data input from ID: ' + device_id + ', with Token: ' + device_token);
					return false;
				}
			} else {
				console.log('Unauthorized data input from ID: ' + device_id + ', with Token: ' + device_token);
				return false;
			}

			water_data = parseFloat(water_data);
			l_min_data = parseFloat(l_min_data);
			l_hour_data = parseFloat(l_hour_data);

			/* Checker for Numbers */
			if (isNaN(water_data)) {
				water_data = 0;
			}
			if (isNaN(l_min_data)) {
				l_min_data = 0;
			}
			if (isNaN(l_hour_data)) {
				l_hour_data = 0;
			}

			/* Forfeit all 0 data if previous data is 0 */
			var sensorData = SensorData.findOne({'owner_id': device_id, 'sensor_locate': sensor_locate}, {sort: {'created_date': -1}});
			if(sensorData){
				if((water_data === 0) && (!sensorData.water_data)){
					// this is to prevent redundant 0 in database
					return false;
				}	
			}
			if(water_data > 0.2){
				// this is to prevent error of hardware suddenly input higher water value
				// the maximum water data is 33.333 L/min = 0.5556 L/second
				return false;
			}

			var time = new Date();
			var ISOTime = time.toISOString();
			var timeChecker1 = moment(time).format('MMMM Do YYYY');
			var timeChecker2 = time.getTime(); // Returns the number of milliseconds since midnight Jan 1 1970
			var timeChecker3 = moment(time).format('YYYY');
			var timeChecker4 = moment(time).format('MMMM YYYY');

			SensorData.insert({
				'created_date': ISOTime,
				'owner_id': device_id,
				'sensor_locate': sensor_locate,
				'water_data': water_data,
				'l_min_data': l_min_data,
				'l_hour_data': l_hour_data
			});


			/*====================================*/
			/* Year Total Consumption & Flow Rate */
			/*====================================*/
			var todayTotal = TodayTotal.findOne({
				'owner_id': device_id
			});
			var todayRate = TodayRate.findOne({
				'owner_id': device_id
			});
			var yearTotal = YearTotal.findOne({
				'owner_id': device_id
			});
			var avgRate = AvgRate.findOne({
				'owner_id': device_id
			});
			var monthTotal = MonthTotal.findOne({
				'owner_id': device_id
			});
			var sensorRecords = SensorRecords.findOne({
				'owner_id': device_id
			});
			todayRate.water_data = (l_min_data).toFixed(2);

			// For daily
			if (timeChecker1 === moment(todayTotal.created_date).format('MMMM Do YYYY')) {
				todayTotal.water_data = parseFloat(todayTotal.water_data) + water_data;
				sensorRecords[sensor_locate].day = parseFloat(sensorRecords[sensor_locate].day) + water_data;
			} else {
				todayTotal.water_data = water_data;
				sensorRecords[sensor_locate].day = water_data;
			}

			// For annual total
			if (timeChecker3 === moment(yearTotal.created_date).format('YYYY')) {
				yearTotal.water_data = parseFloat(yearTotal.water_data) + water_data;
				sensorRecords[sensor_locate].year = parseFloat(sensorRecords[sensor_locate].year) + water_data;
			} else {
				yearTotal.water_data = water_data;
				sensorRecords[sensor_locate].year = water_data;
			}

			// For average rate
			if (timeChecker3 === moment(avgRate.created_date).format('YYYY')) {
				if (avgRate.water_data === 0) {
					avgRate.water_data = l_min_data;
				} else {
					avgRate.water_data = (parseFloat(avgRate.water_data) + l_min_data) / 2;
				}
			} else {
				avgRate.water_data = l_min_data;
			}

			// For monthly
			if (timeChecker4 === moment(monthTotal.created_date).format('MMMM YYYY')) {
				monthTotal.water_data = parseFloat(monthTotal.water_data) + water_data;
				sensorRecords[sensor_locate].month = parseFloat(sensorRecords[sensor_locate].month) + water_data;
			} else {
				monthTotal.water_data = water_data;
				sensorRecords[sensor_locate].month = water_data;
			}


			/* Calculate the average value and fix to 3 decimal points*/
			avgRate.water_data = (avgRate.water_data).toFixed(2);
			yearTotal.water_data = (yearTotal.water_data).toFixed(2);
			todayTotal.water_data = (todayTotal.water_data).toFixed(2);
			monthTotal.water_data = (monthTotal.water_data).toFixed(2);
			sensorRecords[sensor_locate].year = (sensorRecords[sensor_locate].year).toFixed(2);
			sensorRecords[sensor_locate].month = (sensorRecords[sensor_locate].month).toFixed(2);
			sensorRecords[sensor_locate].day = (sensorRecords[sensor_locate].day).toFixed(2);

			/* Update all to latest time */
			todayTotal.created_date = ISOTime;
			todayRate.created_date = ISOTime;
			avgRate.created_date = ISOTime;
			yearTotal.created_date = ISOTime;
			monthTotal.created_date = ISOTime;

			/* Update all database */
			TodayTotal.update({
				'owner_id': device_id
			}, todayTotal);
			TodayRate.update({
				'owner_id': device_id
			}, todayRate);
			YearTotal.update({
				'owner_id': device_id
			}, yearTotal);
			AvgRate.update({
				'owner_id': device_id
			}, avgRate);
			MonthTotal.update({
				'owner_id': device_id
			}, monthTotal);
			SensorRecords.update({
				'owner_id': device_id
			}, sensorRecords);

			/* Add data to water calendar */
			Meteor.call('addWaterSchedule', device_id, sensor_locate, water_data);

			/* Check water goal */
			Meteor.call('checkWaterGoal', device_id);

			/* Update Water Goal*/
			Meteor.call('updateWaterGoal', device_id);

			console.log('Received data from device ID: ' + device_id);

		},
		'resetData': function() {
			SensorData.remove({});
		},
		'refreshSensorData': function() {
			var time = new Date();
			var ISOTime = time.toISOString();
			var timeChecker1 = moment(time).format('MMMM Do YYYY');
			var timeChecker2 = time.getTime(); // Returns the number of milliseconds since midnight Jan 1 1970
			var timeChecker3 = moment(time).format('YYYY');
			var timeChecker4 = moment(time).format('MMMM YYYY');

			/*=====================================*/
			/* Today Total Consumption & Flow Rate */
			/*=====================================*/
			var todayData = TodayTotal.findOne({
				'owner_id': Meteor.userId()
			});
			var todayRate = TodayRate.findOne({
				'owner_id': Meteor.userId()
			});
			var todayChecker1 = moment(todayData.created_date).format('MMMM Do YYYY');
			var todayChecker2 = (new Date(todayData.created_date)).getTime();
			if (timeChecker1 !== todayChecker1 && timeChecker2 > todayChecker2) {
				/* Total Consumption Section */
				todayData.water_data = 0; // Reset Data for each new day
				todayData.created_date = ISOTime;
				TodayTotal.update({
					'owner_id': Meteor.userId()
				}, todayData);

				/* Flow Rate Section */
				todayRate.water_data = 0;
				todayRate.created_date = ISOTime;
				TodayRate.update({
					'owner_id': Meteor.userId()
				}, todayRate);
			}

			/*====================================*/
			/* Year Total Consumption & Flow Rate */
			/*====================================*/
			var yearData = YearTotal.findOne({
				'owner_id': Meteor.userId()
			});
			var avgRate = AvgRate.findOne({
				'owner_id': Meteor.userId()
			});
			var yearChecker = moment(yearData.created_date).format('YYYY');
			if (timeChecker3 !== yearChecker && timeChecker3 > yearChecker) {
				yearData.water_data = 0; // Reset Data for each new year
				yearData.created_date = ISOTime;
				YearTotal.update({
					'owner_id': Meteor.userId()
				}, yearData);
			}

			/*===========================*/
			/* Monthly Total Consumption */
			/*===========================*/
			var monthlyData = MonthTotal.findOne({
				'owner_id': Meteor.userId()
			});
			var monthlyChecker1 = moment(monthlyData.created_date).format('MMMM YYYY');
			var monthlyChecker2 = (new Date(monthlyData.created_date)).getTime();
			if (timeChecker4 !== monthlyChecker1 && timeChecker2 > monthlyChecker2) {
				monthlyData.water_data = 0; // Reset Data for each new month
				monthlyData.created_date = ISOTime;
				MonthTotal.update({
					'owner_id': Meteor.userId()
				}, monthlyData);
			}

			console.log('Data Refreshed for user: ' + Meteor.userId());
		},
		'refreshWaterConsumptionPattern': function() {
			var sensorData = SensorData.find({
				'owner_id': Meteor.userId()
			}, {
				sort: {
					'created_date': 1
				}
			}).fetch();

			if (sensorData) {
				var latestTime = sensorData[sensorData.length - 1].created_date;
				var milli = (new Date(latestTime)).getTime(); // Returns the number of milliseconds since midnight Jan 1 1970
				var last48hours = milli - 172800000; // get the last 48 hours data
				var arrayData = [];

				sensorData.forEach(function(data) {
					/* Get data within the last 48 hours */
					if (((new Date(data.created_date)).getTime() >= last48hours) && ((new Date(data.created_date)).getTime() < milli)) {
						arrayData.push(data.water_data);
					}
				});

				/* Get the largest data */
				var largest = arrayData[0];
				for (var i = 0; i < arrayData.length; i++) {
					if (largest < arrayData[i]) {
						largest = arrayData[i];
					}
				}

				/* Update the database */
				ConsumptionPattern.remove({
					'owner_id': Meteor.userId()
				});
				ConsumptionPattern.insert({
					'created_date': (new Date()).toISOString(),
					'owner_id': Meteor.userId(),
					'max_value': largest,
					'array_data': arrayData
				});
			}

		}
	});
}