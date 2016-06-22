if (Meteor.isClient) {

	renderWaterForecast = function() {
		$(".refreshForecast").html('Refresh Forecast Data');
		$('.refreshForecast').attr("disabled", false);
		var arrayData = ForecastCollection.findOne();

		/* Line chart configuration for hour forecast */
		var lineData = {
			labels: arrayData.array_time,
			datasets: [{
				label: "Litres",
				fillColor: "rgba(178, 224, 255,0.5)",
				strokeColor: "rgba(102, 193, 255,0.7)",
				pointColor: "rgba(102, 193, 255,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(26,179,148,1)",
				data: arrayData.array_data.map(function(data){
					return data;
				})
			}]
		};

		var lineOptions = {
			scaleShowGridLines: true,
			scaleGridLineColor: "rgba(0,0,0,.05)",
			scaleGridLineWidth: 1,
			bezierCurve: true,
			bezierCurveTension: 0.4,
			pointDot: true,
			pointDotRadius: 4,
			pointDotStrokeWidth: 1,
			pointHitDetectionRadius: 20,
			datasetStroke: true,
			datasetStrokeWidth: 2,
			datasetFill: true,
			responsive: true
		};

		$("#lineChart").remove();
		$(".canvasHolder").append('<canvas id="lineChart" width="auto" height="80%"></canvas>');

		var ctx = document.getElementById("lineChart").getContext("2d");
		var myNewChart = new Chart(ctx).Line(lineData, lineOptions);
	};

	// display 48-hours temperature pattern in dashboard
	renderConsumptionPatten = function() {

		/* Refresh Databse Everytime */
		Meteor.call('refreshWaterConsumptionPattern');

		/* Dataset Configuration for temperature pattern data */
		var waterPattern = ConsumptionPattern.findOne({});
		var data = [];
		for (var j = 0; j < waterPattern.array_data.length; j++) {
			data.push(waterPattern.array_data[j]);
		}

		/* Flot-line-chart-moving configuration for temperature pattern */
		var container = $("#flot-line-chart-moving");
		// Determine how many data points to keep based on the placeholder's initial size;
		// this gives us a nice high-res plot while avoiding more than one point per pixel.
		var maximum = waterPattern.array_data.length;

		function getDataRealTime() {
			if (data.length) {
				data.push(data[0]);
				data = data.slice(1); // this eliminate first data and allow next data to come in
			}
			var res = [];
			for (var i = 0; i < data.length; ++i) {
				res.push([i, data[i]]);
			}
			return res;
		}

		series = [{
			data: getDataRealTime(),
			lines: {
				fill: true
			}
		}];


		var plot = $.plot(container, series, {
			grid: {
				color: "#999999",
				tickColor: "#D4D4D4",
				borderWidth: 0,
				minBorderMargin: 20,
				labelMargin: 10,
				hoverable: true,
				clickable: true,
				backgroundColor: {
					colors: ["#ffffff", "#ffffff"]
				},
				margin: {
					top: 8,
					bottom: 20,
					left: 20
				},
				markings: function(axes) {
					var markings = [];
					var xaxis = axes.xaxis;
					for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
						markings.push({
							xaxis: {
								from: x,
								to: x + xaxis.tickSize
							},
							color: "#fff"
						});
					}
					return markings;
				}
			},
			colors: ["#B2E0FF"],
			xaxis: {
				tickFormatter: function() {
					return "";
				}
			},
			yaxis: {
				min: 0,
				max: waterPattern.max_value + 0.01
			},
			legend: {
				show: true
			}
		});

		// bind event hover
		container.bind("plothover", function(event, pos, item) {
			$("#flot-data").text("Current Water Consumption point: " + (pos.y).toFixed(2) + " Litres");
		});

		// bind event mouseout
		container.bind("mouseout", function() {
			$("#flot-data").text("*Water Consumption Unit in Litres.");
		});

		setInterval(function updateRandom() {
			series[0].data = getDataRealTime();
			plot.setData(series);
			plot.draw();
		}, 120);
	};

	renderDashBoardGoal = function() {
		var goal = WaterGoal.findOne({});

		var val = (parseFloat(goal.daily_data.data_goal) - parseFloat(goal.daily_data.usage)).toFixed(2);
		var doughnutData = [{
			value: parseFloat(val),
			color: "#cceaff",
			highlight: "#B2E0FF",
			label: "Quota Available (Litres)"
		}, {
			value: parseFloat(goal.daily_data.usage),
			color: "#f2f2f2",
			highlight: "#dedede",
			label: "Water Used (Litres)"
		}];

		var doughnutOptions = {
			segmentShowStroke: true,
			segmentStrokeColor: "#fff",
			segmentStrokeWidth: 2,
			percentageInnerCutout: 0, // This is 0 for Pie charts
			animationSteps: 100,
			animationEasing: "easeInOutQuart",
			animateRotate: true,
			animateScale: false,
			responsive: true
		};

		var ctx = document.getElementById("doughnutChart").getContext("2d");
		var myNewChart = new Chart(ctx).Doughnut(doughnutData, doughnutOptions);
	};

	renderWaterGoalOverview = function() {
		var goal = WaterGoal.findOne({});

		var val1 = (parseFloat(goal.annual_data.data_goal) - parseFloat(goal.annual_data.usage)).toFixed(2);
		var annualData = [{
			value: parseFloat(val1),
			color: "#cceaff",
			highlight: "#B2E0FF",
			label: "Remaining (Litres)"
		}, {
			value: parseFloat(goal.annual_data.usage),
			color: "#f2f2f2",
			highlight: "#dedede",
			label: "Used (Litres)"
		}];

		var val2 = (parseFloat(goal.monthly_data.data_goal) - parseFloat(goal.monthly_data.usage)).toFixed(2);
		var monthlyData = [{
			value: parseFloat(val2),
			color: "#cceaff",
			highlight: "#B2E0FF",
			label: "Remaining (Litres)"
		}, {
			value: parseFloat(goal.monthly_data.usage),
			color: "#f2f2f2",
			highlight: "#dedede",
			label: "Used (Litres)"
		}];

		var val3 = (parseFloat(goal.daily_data.data_goal) - parseFloat(goal.daily_data.usage)).toFixed(2);
		var dailyData = [{
			value: parseFloat(val3),
			color: "#cceaff",
			highlight: "#B2E0FF",
			label: "Remaining (Litres)"
		}, {
			value: parseFloat(goal.daily_data.usage),
			color: "#f2f2f2",
			highlight: "#dedede",
			label: "Used (Litres)"
		}];

		var val4 = (parseFloat(goal.water_closet_data.year_goal) - parseFloat(goal.water_closet_data.year_usage)).toFixed(2);
		var waterClosetAnnualData = [{
			value: parseFloat(val4),
			color: "#ccffcc",
			highlight: "#99ff99",
			label: "Remaining (Litres)"
		}, {
			value: parseFloat(goal.water_closet_data.year_usage),
			color: "#f2f2f2",
			highlight: "#dedede",
			label: "Used (Litres)"
		}];

		var val5 = (parseFloat(goal.water_closet_data.month_goal) - parseFloat(goal.water_closet_data.month_usage)).toFixed(2);
		var waterClosetMonthlyData = [{
			value: parseFloat(val5),
			color: "#ccffcc",
			highlight: "#99ff99",
			label: "Remaining (Litres)"
		}, {
			value: parseFloat(goal.water_closet_data.month_usage),
			color: "#f2f2f2",
			highlight: "#dedede",
			label: "Used (Litres)"
		}];

		var val6 = (parseFloat(goal.water_closet_data.day_goal) - parseFloat(goal.water_closet_data.day_usage)).toFixed(2);
		var waterClosetDailyData = [{
			value: parseFloat(val6),
			color: "#ccffcc",
			highlight: "#99ff99",
			label: "Remaining (Litres)"
		}, {
			value: parseFloat(goal.water_closet_data.day_usage),
			color: "#f2f2f2",
			highlight: "#dedede",
			label: "Used (Litres)"
		}];

		var val7 = (parseFloat(goal.bathroom_data.year_goal) - parseFloat(goal.bathroom_data.year_usage)).toFixed(2);
		var bathroomAnnualData = [{
			value: parseFloat(val7),
			color: "#ffd9b3",
			highlight: "#ffbf80",
			label: "Remaining (Litres)"
		}, {
			value: parseFloat(goal.bathroom_data.year_usage),
			color: "#f2f2f2",
			highlight: "#dedede",
			label: "Used (Litres)"
		}];

		var val8 = (parseFloat(goal.bathroom_data.month_goal) - parseFloat(goal.bathroom_data.month_usage)).toFixed(2);
		var bathroomMonthlyData = [{
			value: parseFloat(val8),
			color: "#ffd9b3",
			highlight: "#ffbf80",
			label: "Remaining (Litres)"
		}, {
			value: parseFloat(goal.bathroom_data.month_usage),
			color: "#f2f2f2",
			highlight: "#dedede",
			label: "Used (Litres)"
		}];

		var val9 = (parseFloat(goal.bathroom_data.day_goal) - parseFloat(goal.bathroom_data.day_usage)).toFixed(2);
		var bathroomDailyData = [{
			value: parseFloat(val9),
			color: "#ffd9b3",
			highlight: "#ffbf80",
			label: "Remaining (Litres)"
		}, {
			value: parseFloat(goal.bathroom_data.day_usage),
			color: "#f2f2f2",
			highlight: "#dedede",
			label: "Used (Litres)"
		}];

		var val10 = (parseFloat(goal.kitchen_data.year_goal) - parseFloat(goal.kitchen_data.year_usage)).toFixed(2);
		var kitchenAnnualData = [{
			value: parseFloat(val10),
			color: "#ff9999",
			highlight: "#ff6666",
			label: "Remaining (Litres)"
		}, {
			value: parseFloat(goal.kitchen_data.year_usage),
			color: "#f2f2f2",
			highlight: "#dedede",
			label: "Used (Litres)"
		}];

		var val11 = (parseFloat(goal.kitchen_data.month_goal) - parseFloat(goal.kitchen_data.month_usage)).toFixed(2);
		var kitchenMonthlyData = [{
			value: parseFloat(val11),
			color: "#ff9999",
			highlight: "#ff6666",
			label: "Remaining (Litres)"
		}, {
			value: parseFloat(goal.kitchen_data.month_usage),
			color: "#f2f2f2",
			highlight: "#dedede",
			label: "Used (Litres)"
		}];

		var val12 = (parseFloat(goal.kitchen_data.day_goal) - parseFloat(goal.kitchen_data.day_usage)).toFixed(2);
		var kitchenDailyData = [{
			value: parseFloat(val12),
			color: "#ff9999",
			highlight: "#ff6666",
			label: "Remaining (Litres)"
		}, {
			value: parseFloat(goal.kitchen_data.day_usage),
			color: "#f2f2f2",
			highlight: "#dedede",
			label: "Used (Litres)"
		}];

		var doughnutOptions = {
			segmentShowStroke: true,
			segmentStrokeColor: "#fff",
			segmentStrokeWidth: 2,
			percentageInnerCutout: 0, // This is 0 for Pie charts
			animationSteps: 100,
			animationEasing: "easeInOutQuart",
			animateRotate: true,
			animateScale: false,
			responsive: true
		};

		/* Render for current goal */
		var ctx = document.getElementById("doughnutChart1").getContext("2d");
		var myNewChart = new Chart(ctx).Doughnut(annualData, doughnutOptions);
		setTimeout(function() {
			var ctx = document.getElementById("doughnutChart2").getContext("2d");
			var myNewChart = new Chart(ctx).Doughnut(monthlyData, doughnutOptions);
		}, 300);
		setTimeout(function() {
			var ctx = document.getElementById("doughnutChart3").getContext("2d");
			var myNewChart = new Chart(ctx).Doughnut(dailyData, doughnutOptions);
		}, 600);


		/* Render for Water Closet goal */
		var ctx = document.getElementById("doughnutChart4").getContext("2d");
		var myNewChart = new Chart(ctx).Doughnut(waterClosetAnnualData, doughnutOptions);
		setTimeout(function() {
			var ctx = document.getElementById("doughnutChart5").getContext("2d");
			var myNewChart = new Chart(ctx).Doughnut(waterClosetMonthlyData, doughnutOptions);
		}, 300);
		setTimeout(function() {
			var ctx = document.getElementById("doughnutChart6").getContext("2d");
			var myNewChart = new Chart(ctx).Doughnut(waterClosetDailyData, doughnutOptions);
		}, 600);


		/* Render for Bathroon goal */
		var ctx = document.getElementById("doughnutChart7").getContext("2d");
		var myNewChart = new Chart(ctx).Doughnut(bathroomAnnualData, doughnutOptions);
		setTimeout(function() {
			var ctx = document.getElementById("doughnutChart8").getContext("2d");
			var myNewChart = new Chart(ctx).Doughnut(bathroomMonthlyData, doughnutOptions);
		}, 300);
		setTimeout(function() {
			var ctx = document.getElementById("doughnutChart9").getContext("2d");
			var myNewChart = new Chart(ctx).Doughnut(bathroomDailyData, doughnutOptions);
		}, 600);

		/* Render for Kitchen goal */
		var ctx = document.getElementById("doughnutChart10").getContext("2d");
		var myNewChart = new Chart(ctx).Doughnut(kitchenAnnualData, doughnutOptions);
		setTimeout(function() {
			var ctx = document.getElementById("doughnutChart11").getContext("2d");
			var myNewChart = new Chart(ctx).Doughnut(kitchenMonthlyData, doughnutOptions);
		}, 300);
		setTimeout(function() {
			var ctx = document.getElementById("doughnutChart12").getContext("2d");
			var myNewChart = new Chart(ctx).Doughnut(kitchenDailyData, doughnutOptions);
		}, 600);
	};

	setWaterGoals1 = function(){
		var value = $('#yearGoalInput').val();
		$('#monthGoalInput').val((value/12).toFixed(2));
		$('#dayGoalInput').val((value/365).toFixed(2));

		$('#WaterClosetGoalInput').val((value/365/3).toFixed(2));
		$('#BathroomGoalInput').val((value/365/3).toFixed(2));
		$('#KitchenGoalInput').val((value/365/3).toFixed(2));
	};

	setWaterGoals2 = function(){
		var value = $('#monthGoalInput').val();
		$('#yearGoalInput').val((value*12).toFixed(2));
		$('#dayGoalInput').val((value/30.4167).toFixed(2));

		$('#WaterClosetGoalInput').val((value/30.4167/3).toFixed(2));
		$('#BathroomGoalInput').val((value/30.4167/3).toFixed(2));
		$('#KitchenGoalInput').val((value/30.4167/3).toFixed(2));
	};

	setWaterGoals3 = function(){
		var value = $('#dayGoalInput').val();
		$('#yearGoalInput').val((value*365).toFixed(2));
		$('#monthGoalInput').val((value*30.4167).toFixed(2));

		$('#WaterClosetGoalInput').val((value/3).toFixed(2));
		$('#BathroomGoalInput').val((value/3).toFixed(2));
		$('#KitchenGoalInput').val((value/3).toFixed(2));
	};

	setAllWaterGoals = function(){
		var final_value;
		var value1 = parseFloat($('#WaterClosetGoalInput').val());
		var value2 = parseFloat($('#BathroomGoalInput').val());
		var value3 = parseFloat($('#KitchenGoalInput').val());
		if(isNaN(value1)){
			value1 = 0;
		}
		if(isNaN(value2)){
			value2 = 0;
		}
		if(isNaN(value3)){
			value3 = 0;
		}

		final_value = value1 + value2 + value3;

		$('#dayGoalInput').val(final_value);
		$('#monthGoalInput').val(final_value * 30.4167);
		$('#yearGoalInput').val(final_value * 365);
	};


	renderHourForecast = function() {
		/* Dataset Configuration for hour forecast data */
		var hourForecastData = HourForecast.findOne({});
		var arrayData = [];
		for (var i = 0; i < hourForecastData.forecast_data.length; i++) {
			var d = new Date(hourForecastData.forecast_data[i].forecastTime);

			arrayData.push({
				'timestamp': d.getTime(),
				'precipitation': hourForecastData.forecast_data[i].precipitation,
				'windSpd': hourForecastData.forecast_data[i].windSpeed,
				'temperature': hourForecastData.forecast_data[i].temperature
			});
		}

		Morris.Area({
			resize: true,
			hideHover: true,
			element: 'lineChartForecast',
			data: arrayData,
			xkey: 'timestamp',
			ykeys: ['precipitation', 'windSpd', 'temperature'],
			labels: ['Precipitation (÷100 mm/hr)', 'Wind Speed (÷10 m/s)', 'Temperature (°C)'],
			xLabelFormat: function(x) {
				return moment(x.toString()).format('ha');
			}
		});
	};

	renderTemperaturePatten = function() {
		/* Dataset Configuration for temperature pattern data */
		var tempPatternData = TemperaturePattern.findOne({});
		var arrayTempPattern = [];
		for (var j = 0; j < tempPatternData.temperature_pattern.length; j++) {
			arrayTempPattern.push(tempPatternData.temperature_pattern[j].temperature);
		}

		/* Flot-line-chart-moving configuration for temperature pattern */
		var container = $("#flot-line-chart-moving");
		// Determine how many data points to keep based on the placeholder's initial size;
		// this gives us a nice high-res plot while avoiding more than one point per pixel.
		var maximum = tempPatternData.temperature_pattern.length;
		var data = arrayTempPattern;

		function getDataRealTime() {
			if (data.length) {
				data.push(data[0]);
				data = data.slice(1); // this eliminate first data and allow next data to come in
			}
			var res = [];
			for (var i = 0; i < data.length; ++i) {
				res.push([i, data[i]]);
			}
			return res;
		}

		series = [{
			data: getDataRealTime(),
			lines: {
				fill: true
			}
		}];


		var plot = $.plot(container, series, {
			grid: {

				color: "#999999",
				tickColor: "#D4D4D4",
				borderWidth: 0,
				minBorderMargin: 20,
				labelMargin: 10,
				hoverable: true,
				clickable: true,
				backgroundColor: {
					colors: ["#ffffff", "#ffffff"]
				},
				margin: {
					top: 8,
					bottom: 20,
					left: 20
				},
				markings: function(axes) {
					var markings = [];
					var xaxis = axes.xaxis;
					for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
						markings.push({
							xaxis: {
								from: x,
								to: x + xaxis.tickSize
							},
							color: "#fff"
						});
					}
					return markings;
				}
			},
			colors: ["#b3ffb3"],
			xaxis: {
				tickFormatter: function() {
					return "";
				}
			},
			yaxis: {
				min: 0,
				max: 50
			},
			legend: {
				show: true
			}
		});

		// bind event hover
		container.bind("plothover", function(event, pos, item) {
			$("#temp-data").text("Current Temperature point: " + (pos.y).toFixed(2) + " degree Celsius");
		});

		// bind event mouseout
		container.bind("mouseout", function() {
			$("#temp-data").text("*Temperature unit in degree Celsius.");
		});

		setInterval(function updateRandom() {
			series[0].data = getDataRealTime();
			plot.setData(series);
			plot.draw();
		}, 120);
	};

	renderCalendar = function(database) {
		var date = new Date();
		var d = date.getDate();
		var m = date.getMonth();
		var y = date.getFullYear();

		/* Calendar configurations */
		$('#calendar').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			editable: true,
			droppable: true, // this allows things to be dropped onto the calendar
			drop: function() {

			},
			eventDrop: function(event, delta, revertFunc) {

			},
			eventResize: function(event, delta, revertFunc, jsEvent, ui, view) {

			},
			eventClick: function(event, jsEvent, view) {
				Meteor.call('getCalendarModal', event.sensor_locate, new Date(event.start)); // to show clicked event for modal
				$('.eventModal').modal('show');
				$('.eventModal').on('shown.bs.modal', function() {
					$('.eventModal').focus();
				});
			},
			dayClick: function(date, jsEvent, view) {

			},
			events: database
		});
	};

	renderRealTime = function(dbNotation, allData, timeFrame, SensorName) {
		// arrayData in x and y format
		var rawData = SensorData.find({
			'sensor_locate': dbNotation
		}, {sort: {created_date: 1}}).fetch();
		var arrayData = [];

		for (var i = 0; i < rawData.length; i++) {
			arrayData.push({
				'x': (new Date(rawData[i].created_date)).getTime() / 1000,
				'y': rawData[i].water_data
			});
		}
		console.log(arrayData);

		// instantiate our graph!
		var graph = new Rickshaw.Graph({
			element: document.getElementById("realTimeMonitor"),
			width: 960,
			height: 250,
			renderer: 'line',
			series: [{
				name: SensorName,
				color: "#c05020",
				data: arrayData
			}]
		});

		// x-axis label
		var xAxis = new Rickshaw.Graph.Axis.Time({
			graph: graph
		});

		// Show hover detail
		var hoverDetail = new Rickshaw.Graph.HoverDetail({
			graph: graph
		});

		// y-axis label
		var yAxis = new Rickshaw.Graph.Axis.Y({
			graph: graph
		});

		// legend
		var legend = new Rickshaw.Graph.Legend({
			element: document.querySelector('#legend'),
			graph: graph
		});

		// render graph
		graph.render();

		setInterval(function() {

			if (allData) {
				/* Fetch for all real-time data */
				var newRawData = SensorData.find({
					'sensor_locate': dbNotation
				}).fetch();
				if (newRawData.length > arrayData.length) {
					for (var j = 0; j < (newRawData.length - arrayData.length); j++) {
						// arrayData.push(newRawData[j+arrayData.length].database[dbNotation]);
						arrayData.push({
							'x': (new Date(newRawData[j + arrayData.length].created_date)).getTime() / 1000,
							'y': newRawData[j + arrayData.length].water_data
						});
					}
				}
			} else {
				/* Fetch real-time within defined time only */
				var newRawData = SensorData.find({
					'sensor_locate': dbNotation
				}).fetch();
				arrayData.splice(0, arrayData.length);
				var curSecond = (new Date).getTime() / 1000;
				for (var j = 0; j < newRawData.length; j++) {
					if ((curSecond - (new Date(newRawData[j].created_date).getTime() / 1000) <= timeFrame)) {
						arrayData.push({
							'x': (new Date(newRawData[j].created_date)).getTime() / 1000,
							'y': newRawData[j].water_data
						});
					}
				}
			}

			graph.update();
		}, 1000);
	};

	plotLineChart = function(arrayData) {
		/* Convert time format */
		arrayData.forEach(function(data) {
			data.created_date = (new Date(data.created_date)).getTime();
		});

		// initiate morris.js graph plot
		Morris.Line({
			resize: true,
			element: 'lineChart',
			data: arrayData,
			xkey: 'created_date',
			ykeys: ['water_data'],
			labels: ['Water Consumption'],
			yLabelFormat: function(y) {
				return y.toString() + ' Litres';
			},
			xLabelFormat: function(x) {
				return moment(x.toString()).format('ha');
			}
		});
	};


}
