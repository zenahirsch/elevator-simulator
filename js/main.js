define(function (require) {
	var Controller = require('classes/controller');

	var c = new Controller();
	c.registerFloors(10, c);
	c.registerElevators(4, c);
	var e = c.elevators[0];
	var f = c.floors[1];

	f.requestPickup(1);
	e.getPickup();
	console.log(f);
	console.log(e);
	console.log(c);
});