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
			},
      "waterForecast": {
        "url": "https://ussouthcentral.services.azureml.net/workspaces/c1dfab67787348e7a1230b68250cbc6f/services/c04b2eaa416f4bb58090096cd71f4f3b/execute?api-version=2.0",
        "auth": "Bearer UEuAbEJC8jfn3CFXcQLQK/P0Nnd1tElqKhf1/WVHZ83LujI75peILqNNw/mLq7k04WBCgCIFEqN0sLa1z4PcZQ=="
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
