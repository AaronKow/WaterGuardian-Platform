if (Meteor.isServer) {
	Meteor.methods({
		'getWaterForecast': function() {
			var sensorData = SensorData.find({
				'owner_id': Meteor.userId()
			});

			var arrayData1 = [],
				arrayData2 = [];
			var artificialPush1 = false,
				artificialPush2 = false;
			var benchmarkTime;

			for (var i = 0; i < 24; i++) {
				sensorData.forEach(function(data1) {
					if (i == moment(data1.created_date).format('H')) {
						// console.log('Current Time: ' + i + ' = '+ moment(data1.created_date).format('H') + ', '+ moment(data1.created_date).format('MMMM Do YYYY'));

						if (arrayData1.length) {
							arrayData1.forEach(function(data2) {
								if ((moment(data1.created_date).format('MMMM Do YYYY') === moment(data2.created_date).format('MMMM Do YYYY')) && (moment(data1.created_date).format('H') === moment(data2.created_date).format('H'))) {
									// console.log(data1);
									data2.water_data += data1.water_data;
									artificialPush1 = false;
								} else {
									artificialPush1 = true;
								}
							});

							// console.log('test1');
						} else {
							artificialPush1 = true;
						}
						if (artificialPush1) {
							arrayData1.push({
								'water_data': data1.water_data,
								'created_date': data1.created_date,
								'date': moment(data1.created_date).format('D'),
								'hour': i
							});
							artificialPush1 = false;
						}
					} else {
						if (arrayData2.length) {
							arrayData2.forEach(function(data3) {
								if ((moment(data1.created_date).format('MMMM Do YYYY') === moment(data3.created_date).format('MMMM Do YYYY')) && (i == data3.hour)) {
									// Do nothing
									artificialPush2 = false;
									// console.log('test1');
								} else {
									artificialPush2 = true;
									// console.log('test2');
								}
							});
						} else {
							artificialPush2 = true;
						}
						if (artificialPush2) {
							arrayData2.push({
								'water_data': 0,
								'created_date': data1.created_date,
								'date': moment(data1.created_date).format('D'),
								'hour': i
							});
							artificialPush2 = false;
						}
					}
				});
			}
			// console.log(arrayData2.indexOf(arrayData1.created_date));

			var spliceData = [];
			arrayData1.forEach(function(data1) {
				arrayData2.forEach(function(data2) {
					if ((moment(data1.created_date).format('MMMM Do YYYY') === moment(data2.created_date).format('MMMM Do YYYY')) && (data1.hour == data2.hour)) {
						spliceData.push(data2);
					}
				});
			});
			spliceData.forEach(function(data) {
				arrayData2.splice(arrayData2.indexOf(data), 1);
			});

			var finalArray = arrayData1.concat(arrayData2); // combine arrayData1 and arrayData2

			/* For Debug Readings */
			// finalArray.forEach(function(data){
			// 	console.log('Date/Time: ' + data.hour + moment(data.created_date).format(' Ha MMMM Do YYYY') + ' Data: ' + data.water_data);
			// });

			/* Delete previous data to get latest data */
			WaterForecast.remove({'owner_id': Meteor.userId()});
			finalArray.forEach(function(data) {
				WaterForecast.insert({
					'owner_id': Meteor.userId(),
					'water_data': data.water_data,
					'created_date': data.created_date,
					'date': data.date,
					'hour': data.hour
				});
			});

			/* For debug purpose */
			// var debug = WaterForecast.find({'owner_id': Meteor.userId()}, {sort: {'date': 1,'hour': 1}}).fetch();
			// debug.forEach(function(data) {
			// 	console.log('Hour (24-hour): ' + data.hour + ', Recorded at: (' + moment(data.created_date).format('ha MMMM Do YYYY') + '), Data: ' + data.water_data);
			// });

			var fetchData = WaterForecast.find({'owner_id': Meteor.userId()}, {sort: {'date': 1,'hour': 1}}).fetch();
			var timeString = '', dataString = '';

			fetchData.forEach(function(data){
				timeString += moment(data.created_date).format('M/D/YYYY') + ':' + data.hour + ';';
				dataString += data.water_data + ';';
			});
			/* For debug purpose */
			// console.log(timeString);
			// console.log(dataString);
			// Meteor.call('postForecastHtml', timeString, dataString);


			/* ========================================== */
			/* Post Data for Forecast about Next 24-hours */
			/* ========================================== */
			var timeFormatArray = ['12 am', '1 am', '2 am', '3 am', '4 am', '5 am', '6 am', '7 am', '8 am', '9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm', '10 pm', '11 pm'];
			Meteor.http.call('POST', 'https://ussouthcentral.services.azureml.net/workspaces/c1dfab67787348e7a1230b68250cbc6f/services/c04b2eaa416f4bb58090096cd71f4f3b/execute?api-version=2.0', {
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer UEuAbEJC8jfn3CFXcQLQK/P0Nnd1tElqKhf1/WVHZ83LujI75peILqNNw/mLq7k04WBCgCIFEqN0sLa1z4PcZQ==",
					"Accept": "application/json"
				},
				data: {
					"Inputs": {
						"input1": {
							"ColumnNames": ["Frequency", "Horizon", "Hour", "Value"],
							"Values": [
								["24", "24", timeString, dataString]
							]
						}
					},
					"GlobalParameters": {}
				}
			}, function(err, res) {
				if (err){
					console.log(err);
				}
				else {
					res.data.Results.output1.value.Values[0];
					ForecastCollection.remove({'owner_id': Meteor.userId()});
					ForecastCollection.insert({
						'owner_id': Meteor.userId(),
						'array_data': res.data.Results.output1.value.Values[0],
						'array_time': timeFormatArray
					});
					console.log('Finish fetching water consumption forecast for: ' + Meteor.userId());
					return true;
				}
			});
		},
		'postForecastHtml': function(timeString, dataString) {
			var timeFormatArray = ['12 am', '1 am', '2 am', '3 am', '4 am', '5 am', '6 am', '7 am', '8 am', '9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm', '10 pm', '11 pm'];

			Meteor.http.call('POST', 'https://ussouthcentral.services.azureml.net/workspaces/c1dfab67787348e7a1230b68250cbc6f/services/c04b2eaa416f4bb58090096cd71f4f3b/execute?api-version=2.0', {
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer UEuAbEJC8jfn3CFXcQLQK/P0Nnd1tElqKhf1/WVHZ83LujI75peILqNNw/mLq7k04WBCgCIFEqN0sLa1z4PcZQ==",
					"Accept": "application/json"
				},
				data: {
					"Inputs": {
						"input1": {
							"ColumnNames": ["Frequency", "Horizon", "Hour", "Value"],
							"Values": [
								["24", "24", timeString, dataString]
							]
						}
					},
					"GlobalParameters": {}
				}
			}, function(err, res) {
				if (err){
					console.log(err);
				}
				else {
					// console.log(res.data.Results.output1.value.Values[0]);
					res.data.Results.output1.value.Values[0];
					ForecastCollection.remove({'owner_id': Meteor.userId()});
					ForecastCollection.insert({
						'owner_id': Meteor.userId(),
						'array_data': res.data.Results.output1.value.Values[0],
						'array_time': timeFormatArray
					});
				}
			});
			console.log('Finish fetching water consumption forecast for: ' + Meteor.userId());
		}
	});
}