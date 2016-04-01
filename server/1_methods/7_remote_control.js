if (Meteor.isServer) {
	Meteor.methods({
		'getRemoteState': function(device_id, device_token){
			var ID = RemoteState.findOne({'owner_id': device_id});
			if(ID){
				if(ID.owner_token !== device_token){
					console.log('Unauthorized remote ID from: ' + device_id + ', with Token: ' + device_token);
					return false;
				}
			} else {
				console.log('Unauthorized remote ID from: ' + device_id + ', with Token: ' + device_token);
				return false;
			}

			var result = ID.water_closet + ',' + ID.bathroom + ',' + ID.kitchen;

			return result;

		},
		'setRemoteState': function(owner_id, location, state){
			var remote = RemoteState.findOne({'owner_id': owner_id});

			/* Checker for Numbers */
			state = parseInt(state);
			if (isNaN(state)) {
				state = 0;
			}

			remote[location] = state;
			RemoteState.update({'owner_id': owner_id}, remote);
			console.log("Changing ID: (" + owner_id + ") sensor: (" + location + ") to state: (" + state + ")");
		}
	});
}