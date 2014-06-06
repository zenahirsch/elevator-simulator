define(['./entity'], function (Entity) {
	var Elevator = function (params, controller) {
		this.id = params.id;
		this.capacity = params.capacity || 500;
		this.speed = params.speed || 1000;
		this.controller = controller;

		this.direction = 1;
		this.floor = controller.floors[0];
		//this.behaviors = [];
		this.passengers = [];
	};

	Elevator.prototype = new Entity();

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
	Elevator.prototype.getPickupDestination = function () {
		if (this.direction === 1) {
			for (var i = 0; i < this.controller.pickups.up.length; i++) {
				var pickup = this.controller.pickups.up[i];
				if (pickup.id > this.floor.id && !pickup.isClaimed(1)) {
					console.log('getting up pickup');
					this.destination = this.controller.pickups.up[i]; // set this elevator's destination to the floor
					this.controller.claimedPickups.up[this.id] = this.controller.pickups.up[i]; // set the elevator's index in claimed Pickups.up to this floor
				}

			}
		} else if (this.direction === -1) {
			for (var i = 0; i < this.controller.pickups.down.length; i++) {
				var pickup = this.controller.pickups.down[i];
				if (pickup.id < this.floor.id && !pickup.isClaimed(-1)) {
					console.log('getting down pickup');
					this.destination = this.controller.pickups.down[i]; // set this elevator's destination to the floor
					this.controller.claimedPickups.down[this.id] = this.controller.pickups.down[i]; // set the elevator's index in claimed Pickups.up to this floor
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
		console.log('Elevator ' + this.id + ' moved! (Not really.)');
	};

	return Elevator;
});