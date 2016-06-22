if (Meteor.isServer) {
	Meteor.methods({
		'calendarInit': function(){
			var calendar = Calendar.findOne({'owner_id': Meteor.userId()});

			if(!calendar){
				Calendar.insert({
					'created_date': (new Date()).toISOString(),
					'owner_id': Meteor.userId(),
					'water_schedule': []
				});
			}
		},
		'addWaterSchedule': function(device_id, sensor_locate, water_data, timeInput){
			var calendar = Calendar.findOne({'owner_id': device_id});
			var checker = false;	// checker for data existence

			/* Get Current Time */
			var time = timeInput || new Date();
			var ISOTime = time.toISOString();
			var timeChecker1 = moment(time).format('MMMM Do YYYY');

			/* Make sure water data is a valid number */
			water_data = parseFloat(water_data);
			if(isNaN(water_data)){
				water_data = 0;
			}

			calendar.water_schedule.forEach( function(data){
				// Check if any data exist in the same day and the exact targeted sensor
				if((timeChecker1 === moment(data.start).format('MMMM Do YYYY')) && (sensor_locate === data.sensor_locate)){
					checker = true;
				}
			});

			/* Get total average flow rate for current day */
			var sensorData = SensorData.find({'owner_id': device_id}).fetch();
			var avgFlowRate = 0, counter = 0;
			sensorData.forEach(function(data){
				if((moment(data.created_date).format('MMMM Do YYYY') === timeChecker1) && (data.sensor_locate === sensor_locate)){
					// console.log(moment(data.created_date).format('MMMM Do YYYY'));
					// console.log(moment(data.start).format('MMMM Do YYYY'));
					avgFlowRate += data.l_min_data;
					counter++;
					// console.log(counter);
				}
			});

			// if checker true, update the data internally, else add new data to collection
			if(checker){
				calendar.water_schedule.forEach( function(data){
					// Check if any data exist in the same day and the exact targeted sensor
					if((timeChecker1 === moment(data.start).format('MMMM Do YYYY')) && (sensor_locate === data.sensor_locate)){
						data.water_data = (parseFloat(data.water_data) + water_data).toFixed(2);
						data.title = sensor_locate + ': ' + data.water_data + "Litres";
						data.end = time;
						data.avg_flow_rate = (avgFlowRate/counter).toFixed(2);
					}
				});
			} else {
				if(sensor_locate === "water_closet"){
					calendar.water_schedule.push({
						'title': 'water_closet: ' + (water_data).toFixed(2) + "Litres",
						'start': time,
						'allDay': true,
						'sensor_locate': 'water_closet',
						'description': 'Water Consumption in Water Closet',
						'water_data': (water_data).toFixed(2),
						'avg_flow_rate': (avgFlowRate/counter).toFixed(2)
					});
				}
				else if(sensor_locate === "bathroom"){
					calendar.water_schedule.push({
						'title': 'bathroom: ' + (water_data).toFixed(2) + "Litres",
						'start': time,
						'allDay': true,
						'sensor_locate': 'bathroom',
						'description': 'Water Consumption in Bathroom',
						'water_data': (water_data).toFixed(2),
						'avg_flow_rate': (avgFlowRate/counter).toFixed(2)
					});

				}
				else if(sensor_locate === "kitchen"){
					calendar.water_schedule.push({
						'title': 'kitchen: ' + (water_data).toFixed(2) + "Litres",
						'start': time,
						'allDay': true,
						'sensor_locate': 'kitchen',
						'description': 'Water Consumption in Kitchen',
						'water_data': (water_data).toFixed(2),
						'avg_flow_rate': (avgFlowRate/counter).toFixed(2)
					});

				}
			}



			Calendar.update({'owner_id': device_id}, calendar);
		},
		'getCalendarModal': function(sensor_locate, data_time){
			/* Fetch data in database */
			CalendarModal.remove({'owner_id': Meteor.userId()});
			var calendar = Calendar.findOne({'owner_id': Meteor.userId()});

			calendar.water_schedule.forEach( function(data){
				if((moment(data.start).format('MMMM Do YYYY') === moment(data_time).format('MMMM Do YYYY')) && (data.sensor_locate === sensor_locate)){
					CalendarModal.insert({
						'owner_id': Meteor.userId(),
						'start': data.start,
						'end': data.end || '',
						'sensor_locate': data.sensor_locate,
						'description': data.description,
						'water_data': data.water_data,
						'avg_flow_rate': data.avg_flow_rate
					});
				}
			});
		}
	});
}
