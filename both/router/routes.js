Router.configure({
	layoutTemplate: 'mainLayout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading'
});

Router.route('/', {
	onBeforeAction: function() {
		Router.go('/dashboard');
	}
});

Router.route('/dashboard', {
	onBeforeAction: function() {
		this.render('dashboard');
	},
	waitOn: function() {
		if (!Meteor.userId()) {
			Router.go('/login');
		}
		return [Meteor.subscribe('forecastData'), Meteor.subscribe('hourForecastData'), Meteor.subscribe('temperaturePatternData'), Meteor.subscribe('waterForecastData'), Meteor.subscribe('consumptionPattern'), Meteor.subscribe('yearTotalConsumption'), Meteor.subscribe('todayTotalUsage'), Meteor.subscribe('avgFlowRate'), Meteor.subscribe('currentRate'), Meteor.subscribe('waterGoal')];
	},
	onAfterAction: function() {
		if (this.ready()) {
			SEO.set({
				title: "WaterGuardian | Dashboard"
			});
		}
	}
});

Router.route('/weather-forecast', {
	onBeforeAction: function() {
		this.render('weather');
	},
	waitOn: function() {
		if (!Meteor.userId()) {
			Router.go('/login');
		}
		return [Meteor.subscribe('forecastData'), Meteor.subscribe('hourForecastData'), Meteor.subscribe('temperaturePatternData'), Meteor.subscribe('fullHourForecastData')];
	},
	onAfterAction: function() {
		if (this.ready()) {
			SEO.set({
				title: "WaterGuardian | Weather Forecast"
			});
		}
	}
});

Router.route('/consumption-calendar', {
	onBeforeAction: function() {
		this.render('calendar');
	},
	waitOn: function() {
		if (!Meteor.userId()) {
			Router.go('/login');
		}
		return [Meteor.subscribe('calendarData'), Meteor.subscribe('calendarModal')];
	},
	onAfterAction: function() {
		if (this.ready()) {
			SEO.set({
				title: "WaterGuardian | Consumption Calendar"
			});
		}
	}
});

Router.route('/water-goal', {
	onBeforeAction: function() {
		this.render('waterGoalOverview');
	},
	waitOn: function() {
		if (!Meteor.userId()) {
			Router.go('/login');
		}
		return [Meteor.subscribe('waterGoal')];
	},
	onAfterAction: function() {
		if (this.ready()) {
			SEO.set({
				title: "WaterGuardian | Water Goal"
			});
		}
	}
});

Router.route('/real-time-monitoring/:slug', {
	onBeforeAction: function() {
		this.render('realTime');
	},
	waitOn: function() {
		if (!Meteor.userId()) {
			Router.go('/login');
		}
		return [Meteor.subscribe('sensorData'), Meteor.subscribe('waterGoal'), Meteor.subscribe('remoteState')];
	},
	onAfterAction: function() {
		if (this.ready()) {
			SEO.set({
				title: "WaterGuardian | Real-Time Monitoring"
			});
		}
	}
});

Router.route('/data-logging', {
	onBeforeAction: function() {
		this.render('dataLogging');
	},
	waitOn: function() {
		if (!Meteor.userId()) {
			Router.go('/login');
		}
		return Meteor.subscribe('sensorData');
	},
	onAfterAction: function() {
		if (this.ready()) {
			SEO.set({
				title: "WaterGuardian | Data Logging"
			});
		}
	}
});

Router.route('/email-notification', {
	onBeforeAction: function() {
		this.render('emailNotify');
	},
	waitOn: function() {
		if (!Meteor.userId()) {
			Router.go('/login');
		}
		return Meteor.subscribe('emailAccount');
	},
	onAfterAction: function() {
		if (this.ready()) {
			SEO.set({
				title: "WaterGuardian | Email Notification"
			});
		}
	}
});

Router.route('/api-calls', {
	onBeforeAction: function() {
		this.render('apiCalls');
	},
	waitOn: function() {
		if (!Meteor.userId()) {
			Router.go('/login');
		}
		return Meteor.subscribe('apiCalls');
	},
	onAfterAction: function() {
		if (this.ready()) {
			SEO.set({
				title: "WaterGuardian | API Calls"
			});
		}
	}
});

Router.map(function() {
	this.route('sensordata', {
		path: '/sensordata',
		where: 'server',
		action: function() {
			Meteor.call('inputData', this.request.body.id, this.request.body.token, this.request.body.sensor_locate, this.request.body.water_data, this.request.body.l_min_data, this.request.body.l_hour_data, "");
			// console.log("Water Data: " + this.request.body.water_data);
			// console.log("l_min Data: " + this.request.body.l_min_data);
			// console.log("l_hour Data: " + this.request.body.l_hour_data + "\n");
			// curl --data "id=2g4TJMSfyXEkg6bsQ&token=37344304-e484-4052-b224-c5c8c90ebcee&sensor_locate=water_closet&water_data=1&l_min_data=123.255&l_hour_data=20" http://localhost:3000/sensordata
			this.response.writeHead(200, {
				'Content-Type': 'application/json; charset=utf-8'
			});
			this.response.end('Data is received.\n');
		}
	});
});

Router.map(function() {
	this.route('remotestate', {
		path: '/remotestate',
		where: 'server',
		action: function() {
			var id = this.request.body.id;
			var token = this.request.body.token;
			getData = function(key, cb) {
				// curl --data "id=iQFRHjzn7twoEMD2S&token=6e77e47c-83e4-44cc-b25d-778f653656c3" http://localhost:3000/remotestate
				Meteor.call('getRemoteState', id, token, function(err, res) {
					if (err) throw new Error(err.message);
					else cb && cb(null, res);
				});
			}
			var getDataSync = Meteor.wrapAsync(getData);
			var result = getDataSync('random');

			this.response.writeHead(200, {
				'Content-Type': 'application/json; charset=utf-8'
			});
			this.response.end(result);
		}
	});
});
