UI.registerHelper('formatTimeandDate', function(time) {
	if(time)
		return moment(time).format('ddd, hh:mm a, MM.DD.YYYY');
});

UI.registerHelper('formatTimeandDate2', function(time) {
	if(time)
		return moment(time).format('Do MMMM YYYY');
});

UI.registerHelper('formatTimeandDate3', function(time) {
	if(time)
		return moment(time).format('ha, MM.DD.YYYY');
});

UI.registerHelper('formatTimeandDate4', function(time) {
	if(time)
		return moment(time).format('hh:mm a');
});

UI.registerHelper('formatTimeandDate5', function(time) {
	if(time)
		return moment(time).format('dddd, Do MMMM YYYY, hh:mm a');
});