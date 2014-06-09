define(['./entity'], function (Entity) {
	var Passenger = function (params, controller) {
		this.id = params.id;
		this.name = params.name;
		this.weight = params.weight;

		this.controller = controller;
	};

	Passenger.prototype = new Entity();

	Passenger.prototype.NOT_WAITING = 0;
	Passenger.prototype.WAITING = 1;
	Passenger.prototype.RIDING = 2;

	Passenger.prototype.UP = 1;
	Passenger.prototype.DOWN = -1;

	// The passenger's desired destination
	Passenger.prototype.destination = null;

	// The passenger's weight (pounds)
	Passenger.prototype.weight = 130;

	// Passenger status
	// 0: Not waiting
	// 1: Waiting
	// 2: Entering elevator
	// 3: Riding
	// 4: Exiting
	Passenger.prototype.state = null;

	// The current floor of the passenger
	Passenger.prototype.floor = null;

	// The current elevator of the passenger
	Passenger.prototype.elevator = null;

	// Set the floor of the current passenger
	Passenger.prototype.setFloor = function (floor_id) {
		this.floor = this.controller.floors[floor_id];
	};

	// Get the passenger's current floor
	Passenger.prototype.getFloor = function () {
		return this.floor;
	};

	// Set the destination to a particular floor 
	Passenger.prototype.setDestination = function (floor) {
		this.destination = floor;
	};

	// Get the passenger's current destination
	Passenger.prototype.getDestination = function () {
		return this.destination;
	};

	// Is the passenger on the 0th floor?
	Passenger.prototype.isOnGroundFloor = function () {
		if (this.floor === this.controller.floors[0]) {
			return true;
		} else {
			return false;
		}
	};

	// Is the passenger on the top floor?
	Passenger.prototype.isOnTopFloor = function () {
		if (this.floor === this.controller.floors[this.controller.floors.length - 1]) {
			return true;
		} else {
			return false;
		}
	};

	// Set the passenger's direction to UP
	Passenger.prototype.goUp = function () {
		var floors = this.controller.floors;
		if (this.floor != floors[floors.length - 1]) {
			this.direction = this.UP;
			return true;
		} else {
			return false;
		}
	};

	// Set the passenger's direction to DOWN
	Passenger.prototype.goDown = function () {
		var floors = this.controller.floors;
		if (this.floor != floors[0]) {
			this.direction = this.DOWN;
			return true;
		} else {
			return false;
		}
	};

	// Is this passenger going up?
	Passenger.prototype.isGoingUp = function () {
		if (this.direction === this.UP) {
			return true;
		} else {
			return false;
		}
	};

	// Is this passenger going down?
	Passenger.prototype.isGoingDown = function () {
		if (this.direction === this.DOWN) {
			return true;
		} else {
			return false;
		}
	};

	// Return the current direction of the passenger
	Passenger.prototype.getDirection = function () {
		return this.direction;
	};

	// Is this passenger waiting?
	Passenger.prototype.isWaiting = function () {
		if (this.state === this.WAITING) {
			return true;
		} else {
			return false;
		}
	};

	// Is the passenger riding?
	Passenger.prototype.isRiding = function () {
		if (this.state === this.RIDING) {
			return true;
		} else {
			return false;
		}
	}

	// Set state to WAITING
	Passenger.prototype.wait = function () {
		if (this.state != this.RIDING) {
			this.state = this.WAITING;
		}
	};

	// Set state to NOT_WAITING
	Passenger.prototype.doNotWait = function () {
		this.state = this.NOT_WAITING;
	};

	// Set state to RIDING
	Passenger.prototype.ride = function (elevator) {
		this.state = this.RIDING;
		this.floor = null;
		this.elevator = elevator;
	};

	// Can this passenger enter the specified elevator?
	Passenger.prototype.canEnter = function (elevator) {
		if (elevator.isOpen()) {
			// Add more checks for things like capacity and claustrophobia
			return true;
		} else {
			return false;
		}
	};

	// Enter the specified elevator
	// Add passenger to elevator's passengers array, and
	// remove passenger from floor's passengers array
	// Change passenger state to RIDING
	// Set passenger's floor to null
	Passenger.prototype.enter = function (elevator) {
		elevator.passengers.push(this);
		for (var i = 0; i < this.floor.passengers.length; i++) {
			if (this.floor.passengers[i].id === this.id) {
				this.floor.passengers.splice(i, 1);
			}
		} 
		this.ride(elevator);
	};

	return Passenger;
});