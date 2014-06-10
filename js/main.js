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
	var p = c.passengers[0];


/*  =======================
    PASSENGER BEHAVIORS
    ======================= */

    // If passenger is not waiting, randomly decide whether to wait.
	// 33.3% chance of waiting
	p.registerBehavior(new Behavior(0, function () {
		if (!this.isWaiting() && !this.isRiding()) {
			var r = Math.floor(Math.random() * 3);
			if (r === 2) {
				this.wait();
				if (this.isOnGroundFloor()) {
					this.goUp();
				} else if (this.isOnTopFloor()) {
					this.goDown();
				} else {
					var d = Math.floor(Math.random() * 2);
					d === 0 ? this.goDown() : this.goUp();
				}
			}
		}
	}));

	// If the passenger is waiting, pick a destination above
	// (if direction is UP) or below (if direction is DOWN).
	p.registerBehavior(new Behavior(1, function () {
		if (this.isWaiting()) {
			var floors = this.controller.floors;
			var cur_floor_id = this.floor.id;
			var top_floor_id = floors[this.controller.floors.length - 1].id;
			var bottom_floor_id = floors[0].id;
			var possible_floors = [];

			if (this.isGoingUp()) {
				possible_floors = floors.slice(cur_floor_id + 1, top_floor_id + 1);
			}

			if (this.isGoingDown()) {
				possible_floors = floors.slice(bottom_floor_id, cur_floor_id);
			}

			var r = Math.floor(Math.random() * possible_floors.length);
			this.setDestination(possible_floors[r]);
		}
	}));

	// If the passenger is waiting, and no open elevator
	// in the correct direction is present, continue waiting.
	p.registerBehavior(new Behavior (2, function () {
		if (this.isWaiting()) {
			var passenger_direction = this.get
			var local_elevators = this.floor.getElevators();
			if (local_elevators.length > 0) {
				for (var i = 0; i < local_elevators.length; i++) {
					if (local_elevators[i].getDirection() === this.getDirection() && this.canEnter(local_elevators[i])) {
						this.enter(local_elevators[i]);
						break;
					}
				}
			}
		}
	}));

	// If the passenger is riding an elevator, and the
	// elevator is OPEN, and the elevator is on the
	// passenger's destination floor, enter destination floor.
	// Set passenger state to NOT_WAITING.
	p.registerBehavior(new Behavior(3, function () {
		if (this.isRiding() && this.elevator.isOpen() && this.elevator.isOnFloor(this.getDestination())) {
			this.exit(this.elevator.getFloor());
		}
	}));


/*  =======================
    FLOOR BEHAVIORS
    ======================= */

    // Set floor state to NO_REQUEST.
    f.registerBehavior(new Behavior(0, function () {
    	this.clearRequests();
    }));

    // If there are waiting passengers on this floor, 
    // for each waiting passenger, set the state to the 
    // appropriate request state.
    f.registerBehavior(new Behavior(1, function () {
    	var waiting_passengers = this.getWaitingPassengers();
    	if (waiting_passengers.length > 0) {
    		for (var i = 0; i < waiting_passengers.length; i++) {
    			if (waiting_passengers[i].isGoingUp()) {
    				if (this.isRequestingDown()) {
    					this.requestBoth();
    					break;
    				} else {
    					this.requestUp();
    				}
    			}

    			if (waiting_passengers[i].isGoingDown()) {
    				if (this.isRequestingUp()) {
    					this.requestBoth();
    					break;
    				} else {
    					this.requestDown();
    				}
    			}
    		}
    	}
    }));


/*  =======================
    CONTROLLER BEHAVIORS
    ======================= */

    // Gather pickups from all floors. Sort in down and up pickup arrays.
    c.registerBehavior(new Behavior(0, function () {
    	this.gatherPickups();
    }));

/*
    // If the controller has not reached the max number of
    // passengers, register 1-3 new passenger(s). 
    c.registerBehavior(new Behavior(1, function () {
    	if (this.passengers.length < this.maxPassengers) {
    		var r = Math.floor((Math.random() * 3) + 1);
    		this.registerPassengers(r, this);
    	}
    }));
   */


/*  =======================
    ELEVATOR BEHAVIORS
    ======================= */

	// If the elevator can go no further in its set 
	// direction, reverse direction
	e.registerBehavior(new Behavior(3, function () {
		var top_floor = c.floors[c.floors.length - 1];
		var bottom_floor = c.floors[0];

		if (this.isGoingUp() && this.getFloor() === top_floor) {
			this.reverseDirection();
		} 

		if (this.isGoingDown() && this.getFloor() === bottom_floor) {
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
	// Then, remove from the controller's list of pickups and
	// finally, clear this elevator's destination.
	e.registerBehavior(new Behavior(6, function () {
		if (this.isStopped() && this.isAtDestination()) {
			this.open();
			if (this.isGoingUp()) {
				var ups = this.controller.pickups.up;
				for (var i = 0; i < ups.length; i++) {
					if (this.getDestination().id === ups[i].id) {
						ups.slice(i);
					}
				}
			}

			if (this.isGoingDown()) {
				var downs = this.controller.pickups.down;
				for (var i = 0; i < downs.length; i++) {
					if (this.getDestination().id === downs[i].id) {
						downs.slice(i);
					}
				}
			}

			this.clearDestination();
		}
	}));

	// If the elevator is open and there are no more waiting
	// passengers (in that direction), change state to stop.
	// This is like closing the doors.
	e.registerBehavior(new Behavior(7, function () {
		if (this.isOpen() && !this.floor.hasWaitingPassengers(this.direction)) {
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
			if (this.pickup) {
				destinations.push(this.pickup);
			}
			destinations.sort(function (a, b) {
				return a.id > b.id ? 1 : -1;
			});
			this.setDestination(destinations[0]);
		}
	}));

	// If there are no passengers and no pickup, reverse
	// direction and request new pickup from controller. If
	// there is one, set it as the destination. If there is
	// not, reverse the direction again.
	e.registerBehavior(new Behavior(9, function () {
		if (!this.hasPassengers() && !this.hasPickup()) {
			this.reverseDirection();
			if (!this.setPickup()) {
				this.reverseDirection();
			}
		}
	}));

	// If there is a destination, set state to MOVING.
	// Move up or down one floor toward the destination.
	e.registerBehavior(new Behavior(10, function () {
		if (this.hasDestination()) {
			this.move();
		}
	}));


// UPDATES

	c.updateAll();
	c.updateAll();
	c.updateAll();
	c.updateAll();
	c.updateAll();

});