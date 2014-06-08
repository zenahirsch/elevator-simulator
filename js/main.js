define(function (require) {
	var Controller = require('classes/controller');
	var Behavior = require('classes/behavior');
	var Passenger = require('classes/passenger');

	
	var initialize = function () {
		var c = new Controller();
		c.registerFloors(10, c);
		c.registerElevators(4, c);
		c.registerPassengers(20, c);
		return c;
	};

	var c = initialize();

	var e = c.elevators[0];
	var f = c.floors[0];

/* =======================
   ELEVATOR BEHAVIORS
   ==================== */

   // If no state is set, stop. (Set state to STOP.)
	e.registerBehavior(new Behavior(0, function () {
		if (this.state === null) {
			this.stop();
		}
	}));

	// If no direction is set, set direction to UP.
	e.registerBehavior(new Behavior(1, function () {
		if (this.getDirection() === null) {
			this.setDirectionUp();
		}
	}));

	// If no floor is set, set floor to the 0th floor.
	e.registerBehavior(new Behavior(2, function () {
		if (this.getFloor() === null) {
			this.floor = c.floors[0];
		}
	}));

	// If the elevator can go no further in its set 
	// direction, reverse direction
	e.registerBehavior(new Behavior(3, function () {
		var top_floor = c.floors[c.floors.length - 1];
		var bottom_floor = c.floors[0];

		if (this.directionIsUp() && this.getFloor() === top_floor) {
			this.reverseDirection();
		} 

		if (this.directionIsDown() && this.getFloor() === bottom_floor) {
			this.reverseDirection();
		}
	}));

	// Get nearest pickup (in the correct direction) from controller
	e.registerBehavior(new Behavior(4, function () {
		this.setPickup();
	}));

	// If the current floor is the destination, stop.
	e.registerBehavior(new Behavior(5, function () {
		if (this.isAtDestination()) {
			this.stop();
		}
	}));

	// If the elevtor is stopped and at its destination, open.
	// Then, clear the destination.
	e.registerBehavior(new Behavior(6, function () {
		if (this.isStopped() && this.isAtDestination()) {
			this.open();
			this.clearDestination();
		}
	}));

	// If the elevator is open and there are no more waiting
	// passengers (in that direction), change state to stop.
	// This is like closing the doors.
	e.registerBehavior(new Behavior(7, function () {
		if (this.isOpen() && !this.floor.areWaitingPassengers(this.direction)) {
			this.stop();
		}
	}));

	// If there is no destination, query passengers and
	// pickup for the nearest destination. Set as destination.
	e.registerBehavior(new Behavior(8, function () {
		if (this.getDestination() === null) {
			var destinations = [];
			for (var i = 0; i < this.passengers.length; i++) {
				destinations.push(this.passengers[i].destination);
			}
			destinations.push(this.pickup);
			destinations.sort(function (a, b) {
				return a.id > b.id ? 1 : -1;
			});
			this.setDestination(destinations[0]);
		}
	}));

	// Iff there are no passengers and no pickup, reverse
	// direction and request new pickup from controller. If
	// there is one, set it as the destination.
	e.registerBehavior(new Behavior(9, function () {
		if (!this.hasPassengers() && !this.hasPickup()) {
			this.reverseDirection();
			this.setPickup();
		}
	}));

	// If there is a destination, set state to MOVING.
	// Move up or down one floor toward the destination.
	e.registerBehavior(new Behavior(10, function () {
		if (this.hasDestination()) {
			this.move();
		}
	}));

/* =======================
   CONTROLLER BEHAVIORS
   ==================== */

    // Gather pickups from all floors. Sort in down and up pickup arrays.
    c.registerBehavior(new Behavior(0, function () {
    	this.gatherPickups();
    }));

    c.registerBehavior(new Behavior(1, function () {

    }));

// FLOOR BEHAVIORS


// PASSENGER BEHAVIORS
	

// UPDATES

	c.updateAll();

});