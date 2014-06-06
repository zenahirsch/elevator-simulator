define(function (require) {
	var Controller = require('classes/controller');
	var Behavior = require('classes/behavior');

	
	var c = new Controller();
	c.registerFloors(10, c);
	c.registerElevators(4, c);
	var e = c.elevators[0];
	var f = c.floors[1];

});