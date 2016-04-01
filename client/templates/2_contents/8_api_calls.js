Template.apiCalls.helpers({
	'deviceID': function(data1, data2){
		return ApiCollection.findOne().owner_id;
	},
	'deviceToken': function(){
		return ApiCollection.findOne().owner_token;
	}
});

Template.apiCalls.onRendered(function(){
	Meteor.call('getAPI');
});