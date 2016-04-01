Template.emailNotify.helpers({
	'email': function(){
		return EmailCollect.findOne().email_data;
	}
});

Template.emailNotify.events({
	'click .setEmail': function(evt, tmpl){
		Meteor.call('setEmail', tmpl.find('.emailInput').value);
		window.location.replace("/email-notification");
	}
});