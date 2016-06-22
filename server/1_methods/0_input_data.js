if(Meteor.isServer){
  /* THIS SECTION IS FOR SIMULATION PURPOSES ONLY */

  // Global Variables
  runSimulation = false;

  Meteor.methods({
    'inputRandomData': function(){
      // get device_id & device_token
      var device_id = Meteor.userId();
      var device_token = ApiCollection.findOne({'owner_id': Meteor.userId()}).owner_token;

      // remove all data before insert
      Meteor.call('removeAllData');
      Meteor.call('reinsertAllData');

      // insert manual debug data here, affected files: 2_sensor_data.js, 4_calendar.js
      var time = new Date();
      for(var i=100; i>=0; i--){
        var timeChecker = time.getTime() - (3600000 * i); // this insert data in hourly intervals (1 hour = 3600000 seconds)
        var alteredTime = new Date(timeChecker);

        // generate dummy data for water closet
        // var l_hour_data_wc = _.random(0, 276); // original
        var l_hour_data_wc = _.random(1000, 1990); // for higher data
        var l_min_data_wc = (l_hour_data_wc / 60);
        var water_data_wc = (l_min_data_wc / 60);

        // generate dummy data for bathroom
        // var l_hour_data_b = _.random(0, 216); // original
        var l_hour_data_b = _.random(1000, 1990); // for higher data
        var l_min_data_b = (l_hour_data_b / 60);
        var water_data_b = (l_min_data_b / 60);

        // generate dummy data for kitchen
        // var l_hour_data_k = _.random(0, 384); // original
        var l_hour_data_k = _.random(1000, 1990); // for higher data
        var l_min_data_k = (l_hour_data_k / 60);
        var water_data_k = (l_min_data_k / 60);

        Meteor.call('inputData', device_id, device_token, 'water_closet', water_data_wc.toFixed(4), l_min_data_wc.toFixed(4), l_hour_data_wc, alteredTime);
        Meteor.call('inputData', device_id, device_token, 'bathroom', water_data_b.toFixed(4), l_min_data_b.toFixed(4), l_hour_data_b, alteredTime);
        Meteor.call('inputData', device_id, device_token, 'kitchen', water_data_k.toFixed(4), l_min_data_k.toFixed(4), l_hour_data_k, alteredTime);
      }

      // Patch for the flaw of this simulation
      // START PATCH
      /* TODO : During simulation, there is error on getting the todayUsage value for bathroom & kitchen */
      var calendar = Calendar.findOne({'owner_id': device_id});
      var waterGoal = WaterGoal.findOne({'owner_id': device_id});
      var currentTime = moment(new Date()).format('MMMM Do YYYY');
      var sensorRecords = SensorRecords.findOne({'owner_id': device_id});
      var todayBathroomUsage, todayKitchenUsage;
      calendar.water_schedule.forEach(function(data){
        if(currentTime === moment(data.start).format('MMMM Do YYYY')){
          if(data.sensor_locate === 'bathroom'){
            todayBathroomUsage = data.water_data;
          }
          else if(data.sensor_locate === 'kitchen'){
            todayKitchenUsage = data.water_data;
          }
        }
      });
      // Manually update Bathroom todayUsage value
			waterGoal.bathroom_data.day_usage = todayBathroomUsage;
      sensorRecords.bathroom.day = todayBathroomUsage;
			// Manually update Kitchen todayUsage value
			waterGoal.kitchen_data.day_usage = todayKitchenUsage;
      sensorRecords.kitchen.day = todayKitchenUsage;
			/* Update Datebase */
      WaterGoal.update({'owner_id': device_id}, waterGoal);
			SensorRecords.update({'owner_id': device_id}, sensorRecords);
      // END PATCH

      console.log("Insert random data is done.");
    },
    'removeAllData': function() {
        var device_id = Meteor.userId();
        SensorData.remove({owner_id: device_id});
        Calendar.remove({owner_id: device_id});
        SensorRecords.remove({owner_id: device_id});
        YearTotal.remove({owner_id:device_id});
				MonthTotal.remove({owner_id:device_id});
				TodayTotal.remove({owner_id:device_id});
				AvgRate.remove({owner_id:device_id});
				TodayRate.remove({owner_id:device_id});
		},
    'reinsertAllData': function() {
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

				/* Initiate for Water Usage Calendar */
				Meteor.call('calendarInit');
			}
		},
    'startSimulation':function(sensor_locate){
      console.log("\nStarting simulation for " + sensor_locate);
      var Fiber = Npm.require('fibers');

      // get device_id & device_token & define variables
      var device_id = Meteor.userId();
      var device_token = ApiCollection.findOne({'owner_id': Meteor.userId()}).owner_token;
      var l_hour_data = 0;
      var max_l_hour_data, increment;

      switch(sensor_locate){
        case 'water_closet':
          max_l_hour_data = 276; // insert simulated data for Water Closet, max_flow is 276 Litre/hour
          increment = 69; // increment 4 times to max
          break;

        case 'bathroom':
          max_l_hour_data = 216; // insert simulated data for Bathroom, max_flow is 276 Litre/hour
          increment = 54; // increment 4 times to max
          break;

        case 'kitchen':
          max_l_hour_data = 384; // insert simulated data for Kitchen, max_flow is 276 Litre/hour
          increment = 96; // increment 4 times to max
          break;

        default:
          break;
      }

      // Start Simulation
      runSimulation = true;
      var simulateData = setInterval(function(){
    			if(!runSimulation){
            // Stop Water Flow at Kitchen if goal is reached
            clearInterval(simulateData);
            Fiber(function() {
              Meteor.call('inputData', device_id, device_token, sensor_locate, 0, 0, 0, "");
            }).run();

    			} else {

            if(l_hour_data !== max_l_hour_data){
              l_hour_data += increment;
            }
            var l_min_data = (l_hour_data / 60);
            var water_data = (l_min_data / 60);
            Fiber(function() {
              Meteor.call('inputData', device_id, device_token, sensor_locate, water_data.toFixed(4), l_min_data.toFixed(4), l_hour_data, "");
            }).run();
          }
      }, 1000);
    },
    'stopSimulation': function(){
      runSimulation = false;
    }

  });
}
