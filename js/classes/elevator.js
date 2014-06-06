define(function () {
	var Elevator = function (params, controller) {
		this.id = params.id;
		this.capacity = params.capacity || 500;
		this.speed = params.speed || 1000;
		this.controller = controller;

		this.direction = 1;
		this.floor = controller.floors[0];
		this.behaviors = [];
		this.passengers = [];
	};

	Elevator.prototype.behaviors = null;

	// The id of this elevator 
	Elevator.prototype.id = null;

	// The controller for this elevator
	Elevator.prototype.controller = null;

	// The capacity of the elevator in pounds
	Elevator.prototype.capacity = null;

	// The passengers currently riding in this elevator
	Elevator.prototype.passengers = null;

	// The current floor of the elevator
	Elevator.prototype.floor = null;

	// The destination received from the controller 
	Elevator.prototype.destination = null;

	// Going up or down?
	// 0: none
	// 1: up
	// -1: down
	Elevator.prototype.direction = 0;

	// Receive a pickup from the controller
	Elevator.prototype.getPickup = function () {
		if (this.direction === 1) {

			// get up pickup from controller
			var up_pickups = this.controller.pickups.up;

			// loop through up pick ups 
			for (var i = 0, l = up_pickups.length; i < l; i++) {
				if (up_pickups[i].id > this.floor.id) {
					this.destination = up_pickups.splice(i);
				}
			}

		} else if (this.direction === -1) {
			// get down pickup from controller
			var down_pickups = this.controller.pickups.down;

			// loop through down pick ups 
			for (var i = 0, l = down_pickups.length; i < l; i++) {
				if (down_pickups[i].id < this.floor.id) {
					this.destination = down_pickups.splice(i);
				}
			}

		} else if (this.direction === 0) {
			// get up or down pickup from controller

		}
	};

	// The time (in milliseconds) to travel one floor
	Elevator.prototype.speed = null;

	// Move one floor up or down
	Elevator.prototype.move = function () {

	};

	// Add a behavior to the behavior list
	Elevator.prototype.addBehavior = function (behavior) {
		this.behaviors.push(behavior);
	};

	Elevator.prototype.update = function () {
		for (var i = 0, l = this.behaviors.length; i < l; i++) {
			this.behaviors[i].call(this);
		}
	};

	return Elevator;
});

/*
var e = new Elevator();

e.addBehavior(function () {
	if ()
});

e.update();

e = new Elevator();
e.addBehavior(waitOnFloor(floors[5]));


e2 = new Elevator();
e.addBehavior(waitOnFloor(floors[3]));

function waitOnFloor()) {
	return function () {
		if (this.waiting()) {
			this.goToDefaultFloor();
		}
	}
}

e.addBehavior(function () {
	if (this.broken()) {
		this.maintenance.call();
	}
});
*/