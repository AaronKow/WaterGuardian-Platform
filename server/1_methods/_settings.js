Meteor.startup(function () {
    var environment, settings;

	environment = process.env.METEOR_ENV || "development";

	settings = {
		"services": {
			"forecastIO":{
				"APIkey": "<PLACE YOUR FORECAST.IO API KEY HERE>"
			},
			"mailGun": {
				"APIkey": "<PLACE YOUR MAIL-GUN API KEY HERE>",
				"Domain": "<PLACE YOUR DOMAIN HERE>",
				"senderEmail": "<PLACE YOUR SENDER EMAIL HERE>"
			}
		}
	};

	if (!process.env.METEOR_SETTINGS) {
		Meteor.settings = settings;
		console.log("Using [ " + environment + " ] Meteor.settings");
	}

	if (Meteor.settings && Meteor.settings.public) {
        __meteor_runtime_config__.PUBLIC_SETTINGS = Meteor.settings.public;
    }
});