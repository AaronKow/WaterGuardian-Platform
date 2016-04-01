Meteor.startup(function(){
	sAlert.config({
        effect: 'slide',
        position: 'top-right',
        timeout: 10000,
        html: false,
        onRouteClose: true,
        stack: true,
        offset: '80px',
    });
});