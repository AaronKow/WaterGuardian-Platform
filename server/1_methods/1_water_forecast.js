if (Meteor.isServer) {
	Meteor.methods({
		'getWaterForecast': function() {
			console.log("\n\nCollecting all previous data, please wait ...")

			// get all water data from current user
			var sensorData = SensorData.find({
				'owner_id': Meteor.userId()
			}, {
				sort: {created_date: 1}
			}).fetch();

			var arrayData1 = [],
				arrayData2 = [];
			var artificialPush1 = false,
				artificialPush2 = false;
			var benchmarkTime;

			// sort all the data in 24 hours format
			for (var i = 0; i < 24; i++) {
				sensorData.forEach(function(data1) {
					if (i == moment(data1.created_date).format('H')) {
						if (arrayData1.length) {
							arrayData1.forEach(function(data2) {
								// below function is to ensure to clash when collecting the data
								if ((moment(data1.created_date).format('MMMM Do YYYY') === moment(data2.created_date).format('MMMM Do YYYY')) && (moment(data1.created_date).format('H') === moment(data2.created_date).format('H'))) {
									// console.log(data1);
									data2.water_data += data1.water_data;
									artificialPush1 = false;
								} else {
									artificialPush1 = true;
								}
							});
						} else {
							artificialPush1 = true;
						}
						// artificial push 1 is applicable if water data is presented
						if (artificialPush1) {
							arrayData1.push({
								'water_data': data1.water_data,
								'created_date': data1.created_date,
								'date': moment(data1.created_date).format('D'),
								'hour': i
							});
							artificialPush1 = false;
						}
					}
				});
			}

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

			var fetchData = WaterForecast.find({'owner_id': Meteor.userId()}, {sort: {'date': 1,'hour': 1}}).fetch();
			var timeString = '', dataString = '';

			fetchData.forEach(function(data){
				timeString += moment(data.created_date).format('M/D/YYYY') + ':' + data.hour + ';';
				dataString += data.water_data + ';';
			});
			/* For debug purpose */
			console.log('\n\n');
			console.log(timeString);
			console.log('\n\n');
			console.log(dataString);

			var timeFormatArray = [];
			var timeArray = _.last(fetchData, 24);
			_.each(timeArray, function(data){
				timeFormatArray.push(moment(data.created_date).format('h a'));
			});

			/* ========================================== */
			/* Post Data for Forecast about Next 24-hours */
			/* ========================================== */
			asyncReturn = function(key, callback) {
				Meteor.http.call('POST', Meteor.settings.services.waterForecast.url, {
					headers: {
						"Content-Type": "application/json",
						"Authorization": Meteor.settings.services.waterForecast.auth,
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
						console.log(res.data.Results.output1.value.Values[0]);
						ForecastCollection.remove({'owner_id': Meteor.userId()});
						ForecastCollection.insert({
							'owner_id': Meteor.userId(),
							'array_data': res.data.Results.output1.value.Values[0],
							'array_time': timeFormatArray
						});
						console.log('Finish fetching water consumption forecast for: ' + Meteor.userId());
						callback && callback(null, true);
					}
				});
			};
			var getData =  Meteor.wrapAsync(asyncReturn);
			var result = getData('data');
			return result;
		}
	});
}
