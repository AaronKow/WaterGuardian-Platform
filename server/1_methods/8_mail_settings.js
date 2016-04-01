if (Meteor.isServer) {
	Meteor.methods({
		'setEmail': function(email){
			check(email, String);
			EmailCollect.remove({'owner_id': Meteor.userId()});

			EmailCollect.insert({
				'owner_id': Meteor.userId(),
				'created_date': (new Date()).toISOString(),
				'email_data': email
			});

			console.log("Done setting email notification for account: " + Meteor.userId());
		},
		'sendWarningNotify': function(category) {

			var Mailgun = Meteor.npmRequire('mailgun-js');

			//Your api key, from Mailgun’s Control Panel
			var api_key = Meteor.settings.services.mailGun.APIkey;

			//Your domain, from the Mailgun Control Panel
			var domain = Meteor.settings.services.mailGun.Domain;

			//Your sending email address
			var from_who = Meteor.settings.services.mailGun.senderEmail;

			// Get current recipient from database
			var email = EmailCollect.findOne({'owner_id': Meteor.userId()});
			var recipient = email.email_data;
			
			// Set the subject and text message according to category
			var subject, body;
			if (category === "daily"){
				subject = "WaterGuardian: [Daily Usage have exceed Today Water Goal]";
				body = "Your daily usage have exceed today water goal";
			}
			else if (category === "water_closet"){
				subject = "WaterGuardian: [Water Closet Daily Usage have exceed Today Water Goal]";
				body = "Your water closet daily usage have exceed today water goal.";
			}
			else if (category === "bathroom"){
				subject = "WaterGuardian: [Bathroom Daily Usage have exceed Today Water Goal]";
				body = "Your bathroom daily usage have exceed today water goal.";
			}
			else if (category === "kitchen"){
				subject = "WaterGuardian: [Kitchen Daily Usage have exceed Today Water Goal]";
				body = "Your kitchen daily usage have exceed today water goal.";
			}
			else {
				return false;
			}


			//We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
			var mailgun = new Mailgun({
				apiKey: api_key,
				domain: domain
			});

			var data = {
				//Specify email data
				from: from_who,
				//The email to contact
				to: recipient,
				//Subject and text data  
				subject: subject,
				html: body
			}

			//Invokes the method to send emails given the above data with the helper library
			mailgun.messages().send(data, function(err, body) {
				//If there is an error, render the error page
				if (err) {
					console.log("Error occurred during sending an email: ", err);
				}
				//Else we can greet    and leave
				else {
					//Here "submitted.jade" is the view file for this landing page 
					//We pass the variable "email" from the url parameter in an object rendered by Jade
					
					console.log(body);
				}
			});
		}
	});
}