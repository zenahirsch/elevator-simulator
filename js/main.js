define(function (require) {
	var Controller = require('classes/controller');
	var Behavior = require('classes/behavior');
	var Passenger = require('classes/passenger');

	
	var initialize = function () {
		var c = new Controller();
		c.registerFloors(5, c);
		c.registerElevators(2, c);
		c.registerPassengers(5, c);
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
				console.log('Passenger ' + this.id + ': is now waiting.');
				if (this.isOnGroundFloor()) {
					console.log('Passenger ' + this.id + ': now wants to go up.');
					this.goUp();
				} else if (this.isOnTopFloor()) {
					console.log('Passenger ' + this.id + ': now wants to go down.');
					this.goDown();
				} else {
					var d = Math.floor(Math.random() * 2);
					console.log('Passenger ' + this.id + ': now has a desired direction.');
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
			console.log('Passenger ' + this.id + ': has a new destination: Floor ' + this.getDestination().id);
		}
	}));

	// If the passenger is waiting and there is a local elevator going
	// in the passenger's direction, and the passenger can enter it,
	// then the passenger enters the elevator.
	p.registerBehavior(new Behavior (2, function () {
		if (this.isWaiting()) {
			var passenger_direction = this.get
			var local_elevators = this.floor.getElevators();
			if (local_elevators.length > 0) {
				for (var i = 0; i < local_elevators.length; i++) {
					if (local_elevators[i].getDirection() === this.getDirection() && this.canEnter(local_elevators[i])) {
						console.log('Passenger ' + this.id +': is entering Elevator ' + local_elevators[i].id);
						this.enter(local_elevators[i]);
						break;
					}
				}
			}
		}
	}));


/*  =======================
    FLOOR BEHAVIORS
    ======================= */

    // Set floor state to NO_REQUEST.
    f.registerBehavior(new Behavior(0, function () {
    	console.log('Floor ' + this.id + ': clearing requests.');
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
    					console.log('Floor ' + this.id + ': setting request to BOTH');
    					this.requestBoth();
    					break;
    				} else {
    					console.log('Floor ' + this.id + ': setting request to UP');
    					this.requestUp();
    				}
    			}

    			if (waiting_passengers[i].isGoingDown()) {
    				if (this.isRequestingUp()) {
    					console.log('Floor ' + this.id + ': setting request to BOTH');
    					this.requestBoth();
    					break;
    				} else {
    					console.log('Floor ' + this.id + ': setting request to DOWN');
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
    	console.log('Controller: gathering pickups.');
    	this.gatherPickups();
    	console.log('Controller: found ' + this.pickups.up.length + ' up pickups and ' + this.pickups.down.length + ' down pickups');
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
		console.log('Elevator ' + this.id + ': looking for a pickup.');
		this.setPickup();
		if (this.hasPickup()) {
			console.log('Elevator ' + this.id + ': setting pickup to Floor ' + this.getPickup().id);
		} else {
			console.log('Elevator ' + this.id + ': no pickup set.')
		}
	}));

	// If the current floor is the destination, stop.
	e.registerBehavior(new Behavior(5, function () {
		if (this.isAtDestination()) {
			console.log('Elevator ' + this.id + ': stopping on Floor ' + this.getFloor().id);
			this.stop();
		}
	}));

	// If the elevtor is stopped and at its destination, open.
	// Then, remove from the controller's list of pickups and
	// finally, clear this elevator's destination.
	e.registerBehavior(new Behavior(6, function () {
		if (this.isStopped() && this.isAtDestination()) {
			console.log('Elevator ' + this.id + ': opening doors.');
			this.open();
			if (this.isGoingUp()) {
				var ups = this.controller.pickups.up;
				for (var i = 0; i < ups.length; i++) {
					if (this.getDestination().id === ups[i].id) {
						ups.slice(i, i + 1);
					}
				}
			}

			if (this.isGoingDown()) {
				var downs = this.controller.pickups.down;
				for (var i = 0; i < downs.length; i++) {
					if (this.getDestination().id === downs[i].id) {
						downs.slice(i, i + 1);
					}
				}
			}

			this.clearDestination();
		}
	}));

	// If the elevator is open and it is at one of its passenger's destination,
	// have that passenger exit.
	e.registerBehavior(new Behavior(7, function () {
		if (this.isOpen()) {
			for (var i = 0; i < this.passengers.length; i++) {
				if (this.isOnFloor(this.passengers[i].getDestination())) {
					console.log('Elevator ' + this.id + ': releasing Passenger ' + this.passengers[i].id);
					this.passengers[i].exit(this.getFloor());
				}
			}
		}
	}));

	// If the elevator is open and there are waiting passengers going in its 
	// direction, have those passengers enter.

	// If the elevator is open and there are no more waiting
	// passengers (in that direction), change state to stop.
	// This is like closing the doors.
	e.registerBehavior(new Behavior(7, function () {
		if (this.isOpen() && !this.floor.hasWaitingPassengers(this.direction)) {
			console.log('Elevator ' + this.id + ': closing doors.');
			this.stop();
		}
	}));

	// If there is no destination, query passengers and
	// pickup for the nearest destination. Set as destination.
	e.registerBehavior(new Behavior(8, function () {
		if (this.getDestination() === null) {
			console.log('Elevator ' + this.id + ': no destination, so picking one.');
			var destinations = [];
			for (var i = 0; i < this.passengers.length; i++) {
				console.log('Elevator ' + this.id + ': found a passenger destination.');
				destinations.push(this.passengers[i].destination);
			}
			if (this.pickup) {
				console.log('Elevator ' + this.id + ': adding pickup destination to all possible destinations.');
				destinations.push(this.pickup);
			} else {
				console.log('Elevator ' + this.id + ': no pickup destination found.')
			}
			if (destinations && destinations.length > 0) {
				console.log('Elevator ' + this.id + ': sorting all possible destinations.');
				destinations.sort(function (a, b) {
					return a.id > b.id ? 1 : -1;
				});
				console.log('Elevator ' + this.id + ': the sorted destinations: ');
				console.log(destinations);
				console.log('Elevator ' + this.id + ': picking the first of the sorted destinations: Floor ' + destinations[0].id);
				this.setDestination(destinations[0]);
				console.log('Elevator ' + this.id + ': set destination to Floor ' + this.getDestination().id);
			}
		}
	}));

	// If there are no passengers and no pickup, reverse
	// direction and request new pickup from controller. If
	// there is one, set it as the destination. If there is
	// not, reverse the direction again.
	e.registerBehavior(new Behavior(9, function () {
		if (!this.hasPassengers() && !this.hasPickup()) {
			console.log('Elevator ' + this.id + ': no passengers and no pickup, so reversing direction.');
			this.reverseDirection();
			console.log('Elevator ' + this.id + ': checking for a pickup.');
			if (!this.setPickup()) {
				console.log('Elevator ' + this.id + ': still no pickup, so reversing direction again.');
				this.reverseDirection();
			}
		}
	}));

	// If there is a destination, set state to MOVING.
	// Move up or down one floor toward the destination.
	e.registerBehavior(new Behavior(10, function () {
		if (this.hasDestination()) {
			console.log('Elevator ' + this.id + ': moving one floor.');
			this.move();
		}
	}));


// UPDATES

	c.updateAll();
	c.updateAll();
	c.updateAll();
	c.updateAll();
	c.updateAll();
	c.updateAll();
	c.updateAll();
	c.updateAll();
	c.updateAll();
	c.updateAll();

});