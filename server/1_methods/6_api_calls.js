if (Meteor.isServer) {
	Meteor.methods({
		'getAPI': function(){
			var checker = ApiCollection.findOne({'owner_id': Meteor.userId()});

			if(!checker){
				console.log('Initiate API calls for account: ' + Meteor.userId());
				var owner_token = Meteor.uuid();
				ApiCollection.insert({
					'owner_id': Meteor.userId(),
					'owner_token': owner_token
				});

				RemoteState.insert({
					'owner_id': Meteor.userId(),
					'owner_token': owner_token,
					'water_close': 0,
					'bathroom': 0,
					'kitchen': 0
				});
			}
		}
	});
}