# WaterGuardian Project
WaterGuardian is an IoT prototype designed to conserve water with its two major features, observe + track + control every drop of water you use in home and rain harvesting. Unlike ordinary water conservation system, WaterGuardian is an IoT solution that able to deliver connectivity, real-time capability and data-analysis to users. With connectivity, users can access this system anywhere, anytime at any part of the world (as long as there is internet), all the data will behave in real-time and these tracked data provides valuable insights to users to analyse the consumption pattern in their home and enable them making better decision about their water consumption in the future.

## Work with WaterGuardian Hardware
This project hardware documentation can be found [here](https://github.com/AaronKow/WaterGuardian-Hardware).

## Table of Contents
<!-- toc -->

* [Makers Against Drought](#makers-against-drought)
* [WaterGuardian Platform Source Codes](#waterguardian-platform-source-codes)
* [Meteor Packages](#meteor-packages)
* [How to Use this Source Code](#how-to-use-this-source-code)
* [Features of WaterGuardian Platform](#features-of-waterguardian-platform)
  * [Dashboard](#dashboard)
  * [Weather Forecast](#weather-forecast)
  * [Consumption Calendar](#consumption-calendar)
  * [Water Goal](#water-goal)
  * [Real-time Monitoring](#real-time-monitoring)
  * [Data-Logging](#data-logging)
  * [Email Notification](#email-notification)
  * [API Calls](#api-calls)
* [Testing this Platform](#testing-this-platform)
  * [Generate Random Data for 5-days](#generate-random-data-for-5-days)
  * [Simulation Data for Real-Time Monitoring](#simulation-data-for-real-time-monitoring)
* [License](#license)

<!-- toc stop -->

## Makers Against Drought
This prototype is built and submit for competition in "Makers Against Drought" by Samsung in Devpost, to visit this project, please click [here](http://devpost.com/aaronkow). MAD Challenge is hosted by Samsung to solve water crisis in California.

## WaterGuardian Platform Source Codes
WaterGuardian Platform is a web service that allow users to monitor their water consumption data in real-time, stay updated about the weather, set water goals, preview water usage in calendar mode, get email notification and data logging. This platform is built using Meteor framework, an open-source Javascript web framework that written using Node.js. However, Meteor framework is yet support in ARMv7 Dev Board. Thus, in order to enable Meteor Development in Artik 10 Dev Board, there is an [alternative way](https://github.com/4commerce-technologies-AG/meteor) to install Meteor in your Artik 10. It is a fork of Meteor.js, which is an unofficial Meteor developed by [4commerce-technologies-AG](https://github.com/4commerce-technologies-AG). If you wished to learn how to install alternative Meteor Development in your Artik 10, you can refer to my Hackster Account, [here](https://www.hackster.io/aaronkow). WaterGuardian Platform is a RESTful Model, which works to fetch all the sensors data and controlling the pumps + valves. The API Calls is available in the last navigation tab in the platform. Device ID and Device Token will be initiated for every new account for identification, which serve for secure verification process during transmit the sensors data and controlling. The features of WaterGuardian Platform are included in  section of [Features of WaterGuardian Platform](#features-of-waterguardian-platform).

## Meteor Packages
The Meteor Packages can be found in the file with directory ".meteor > packages":

## How to Use this Source Code
Before initiate the Meteor, you need to set a few configurations. Head to the folder "server > 1_methods", a file contains all the key configurations for the API services called "_settings.js". Please change the configurations with your own keys:

```js
/* Line 6 to 17 */
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
```

During the First time run, you will encounter something like this:
```sh
$ meteor
[[[[[ ~/Desktop/WaterGuardian-Platform]]]]]

=> Started proxy.
=> Started MongoDB.
=> Creating container package for npm modules\

-> npm support has been initialized.
-> please start your app again.
```

That should be fine, because I used a package called "meteorhacks:npm", it requires to download the "npm-container" in the folder packages in order to support npm in Meteor. After that, you should initiate `$meteor` again, and run the code with no problem.

## Features of WaterGuardian Platform
### Dashboard
Allow users to have an overview about the water consumption pattern last 48-hours, current weather, real-time consumption bar, water goal and consumption forecast for next 24-hours.
![WaterGuardian Dashboard](https://raw.githubusercontent.com/AaronKow/WaterGuardian-Platform/master/public/GitHub/WaterGuardian-dashboard.jpg)

### Weather Forecast
Forecast about the weather based on users location, with full report forecast for next 2 days, and temperature pattern within 48-hours.
![WaterGuardian Weather Forecast](https://raw.githubusercontent.com/AaronKow/WaterGuardian-Platform/master/public/GitHub/WaterGuardian_weather_forecast.jpg)

### Consumption Calendar
Enable users to view their water consumption in Calendar mode. Each blocks present with location, description, total usage, average rate and duration gap during usage.
![WaterGuardian Consumption Calendar](https://raw.githubusercontent.com/AaronKow/WaterGuardian-Platform/master/public/GitHub/WaterGuardian_Consumption_Calendar.jpg)

### Water Goal
Enable users to set their own water goal. Water goal determine how much water they want to use, once the actual water consumption exceed their water goal, WaterGuardian will send notification to users and stop the water flow with defined location (eg: water-closet, bathroom, kitchen or all).
![WaterGuardian Water Goal](https://raw.githubusercontent.com/AaronKow/WaterGuardian-Platform/master/public/GitHub/WaterGuardian_Water_Goal.jpg)

### Real-time Monitoring
This provide users with real-time monitoring the consumption flow rate data (unit in L/min). Users can control the water flow here.
![WaterGuardian Real-Time Monitoring](https://raw.githubusercontent.com/AaronKow/WaterGuardian-Platform/master/public/GitHub/WaterGuardian_Real_Time_Monitoring.jpg)

### Email Notification
If the water data consumption has exceeded the water goal, this platform will send an warning email to your email address. So, in this tab, you can configure your email address here. This allow Artik 10 to send email to you. All of this is done using [MailGun API](https://documentation.mailgun.com/api_reference.html).
![WaterGuardian Email Notification](https://raw.githubusercontent.com/AaronKow/WaterGuardian-Platform/master/public/GitHub/WaterGuardian_Email_Notification.jpg)

### Data-Logging
This provide full report about water consumption data to users.
![WaterGuardian Data Logging](https://raw.githubusercontent.com/AaronKow/WaterGuardian-Platform/master/public/GitHub/WaterGuardian_Data_Logging.jpg)

### API Calls
This project is a RESTful model that provide required Device ID and Device Token in order for any IoT device to POST sensor data and GET command from this platform.
![WaterGuardian API Calls](https://raw.githubusercontent.com/AaronKow/WaterGuardian-Platform/master/public/GitHub/WaterGuardian_API_Calls.jpg)

## Testing this Platform
### Generate Random Data for 5-days
In this method, it will generate random data for 5-days.
```javascript
/* To initiate the data generation, you need to type the following in your browser console: */
Meteor.call('inputRandomData');
```

### Simulation Data for Real-Time Monitoring
In the latest update contains the method for simulating the real-time data for water-closet, bathroom and kitchen. The water flow for this simulation is based on the actual water flow from the hardware itself. To initiate the simulation method, you need to type the following in your browser console:
```javascript
/* PLEASE BE NOTE THAT SIMULATION BELOW MUST BE RUN SEPERATELY */
// to start the simulation
Meteor.call('startSimulation', 'water_closet'); // for water closet
Meteor.call('startSimulation', 'bathroom'); // for bathroom
Meteor.call('startSimulation', 'kitchen');  // for kitchen

// to stop the simulation
Meteor.call('stopSimulation');  // this will stop all simulation process
```

## License
The license of this project is under MIT License, see the LICENSE for more information.
